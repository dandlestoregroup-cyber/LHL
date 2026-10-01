"""Local browser regression suite. Live API responses are explicitly synthetic.

Run with webapp-testing with_server.py, a local server, and Python Playwright.
LHL_QA_CHROMIUM may select an existing executable. Never run against production.
"""
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'http://127.0.0.1:3000'
fixture = json.loads(subprocess.check_output(['node', '--import', 'tsx', '-e', "import {DEMO_DATASET} from './src/data/demo.ts'; console.log(JSON.stringify(DEMO_DATASET));"], cwd=ROOT))
checks = []
def passed(name):
    checks.append(name)

with sync_playwright() as p:
    options = {'headless': True}
    if os.environ.get('LHL_QA_CHROMIUM'):
        options.update(executable_path=os.environ['LHL_QA_CHROMIUM'], args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--single-process','--no-zygote'])
    browser = p.chromium.launch(**options)
    context = browser.new_context()
    for width in [360, 390, 430, 1440]:
        page = context.new_page()
        page.set_viewport_size({'width':width, 'height':900})
        page.goto(f'{ORIGIN}/homes/seaward-library')
        page.wait_for_load_state('networkidle')
        expect(page.locator('h1')).to_have_text('The Seaward Library')
        assert page.locator('input[type=date]').evaluate_all('(els)=>els.every(e=>e.value === "")')
        assert page.locator('select').nth(1).locator('option').evaluate_all('(els)=>els.map(e=>e.value)') == ['slow_morning','silent_reading','coastal_discovery']
        passed(f'{width}px: factual home, blank dates and proven-only Moment selection')
        page.locator('#guest-name').fill('Synthetic Journey Guest')
        page.locator('#guest-phone').fill('+20 100 000 0000')
        page.locator('input[type=date]').nth(0).fill('2026-11-01')
        page.locator('input[type=date]').nth(1).fill('2026-11-03')
        page.get_by_role('button',name='Submit Booking Request',exact=True).click()
        expect(page.get_by_role('status').filter(has_text='Request reference')).to_be_visible()
        saved = page.evaluate("JSON.parse(localStorage.getItem('lhl:operating-dataset:demo:v2')).enquiries[0]")
        assert saved['guestName'] == 'Synthetic Journey Guest' and saved['guestPhoneMasked'] == '•••• 0000'
        assert saved['stage'] == 'received' and saved['synthetic'] is True
        assert saved['id'] in page.get_by_role('status').filter(has_text='Request reference').inner_text()
        page.reload()
        page.wait_for_load_state('networkidle')
        assert page.evaluate("JSON.parse(localStorage.getItem('lhl:operating-dataset:demo:v2')).enquiries.some(e=>e.id === '"+saved['id']+"')")
        passed(f'{width}px: durable Demo receipt and refresh preservation')
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), str({'width':width,'elements':page.locator('body *').evaluate_all('(els)=>els.filter(e=>e.getBoundingClientRect().right > innerWidth+1).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,90),right:e.getBoundingClientRect().right}))')})
        passed(f'{width}px: no horizontal overflow')
        for slug in ['does-not-exist','palm-pavilion','stone-courtyard']:
            page.goto(f'{ORIGIN}/homes/{slug}')
            page.wait_for_load_state('networkidle')
            expect(page.get_by_text('This home is not available',exact=True)).to_be_visible()
            assert page.locator('form').count() == 0
        passed(f'{width}px: unknown and withdrawn routes do not fall back to a home')
        page.goto(f'{ORIGIN}/homes/dune-house')
        page.wait_for_load_state('networkidle')
        assert page.locator('form').count() == 0
        passed(f'{width}px: joining home cannot take a booking request')
        page.close()

    # Synthetic Live projection for frontend rejection, pending-write and retry behavior.
    live = json.loads(json.dumps(fixture))
    live['mode'] = 'live'
    for collection in ['partners','properties','assessments','ownerDecisions','enquiries']:
        for record in live[collection]:
            record['dataMode'] = 'live'
            record['synthetic'] = False
    live['partners'] = []; live['enquiries'] = []
    page = context.new_page()
    page.set_viewport_size({'width':390,'height':844})
    page.add_init_script("localStorage.setItem('lhl:active-mode','live')")
    page.route('**/api/auth/me',lambda route: route.fulfill(json={'authenticated':False,'partner':None}))
    page.route('**/api/live/dataset',lambda route: route.fulfill(json={'dataset':live}))
    requests = []; pending = []
    def request_route(route):
        requests.append(route.request.post_data_json)
        if len(requests) == 1:
            route.fulfill(status=503,json={'error':'isolated_write_failure'})
        else:
            pending.append(route)
    page.route('**/api/live/enquiries',request_route)
    page.goto(f'{ORIGIN}/homes/seaward-library')
    page.wait_for_load_state('networkidle')
    expect(page.locator('h1')).to_have_text('The Seaward Library')
    assert page.locator('#guest-name').input_value() == '' and page.locator('#guest-phone').input_value() == ''
    passed('Synthetic Live: no seeded guest identity or contact')
    page.locator('#guest-name').fill('Synthetic Live Guest')
    page.locator('#guest-phone').fill('+20 100 000 0000')
    page.locator('input[type=date]').nth(0).fill('2026-11-01')
    page.locator('input[type=date]').nth(1).fill('2026-11-03')
    page.get_by_role('button',name='Submit Booking Request',exact=True).click()
    expect(page.get_by_role('alert')).to_be_visible()
    assert page.get_by_text('Request reference:',exact=False).count() == 0
    assert page.locator('#guest-name').input_value() == 'Synthetic Live Guest'
    passed('Synthetic Live: rejected persistence preserves input and never displays success')
    page.get_by_role('button',name='Submit Booking Request',exact=True).click()
    expect(page.get_by_role('button',name='Submitting...',exact=True)).to_be_disabled()
    page.locator('form').evaluate('(form)=>form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}))')
    page.wait_for_timeout(300)
    assert len(requests) == 2 and len(pending) == 1
    assert page.get_by_text('Request reference:',exact=False).count() == 0
    passed('Synthetic Live: pending write and duplicate-submit guard')
    assert requests[-1]['guestPhone'] == '+201000000000' and requests[-1]['guestPhoneMasked'] == '•••• 0000'
    pending[0].fulfill(json={'enquiry':{'id':'synthetic-saved-live-request','stage':'received'}})
    expect(page.get_by_role('status').filter(has_text='synthetic-saved-live-request')).to_be_visible()
    passed('Synthetic Live: retry waits for receipt ID and sends normalized private/masked contact')
    page.goto(f'{ORIGIN}/homes/seaward-library')
    page.wait_for_load_state('networkidle')
    page.get_by_role('button',name='العربية',exact=True).click()
    expect(page.locator('html')).to_have_attribute('dir','rtl')
    expect(page.locator('#guest-name')).to_be_visible()
    assert page.locator('select').nth(1).locator('option').count() == 3
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    passed('390px Arabic: RTL form, proven Moments and no overflow')
    page.set_viewport_size({'width':1440,'height':900})
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    passed('1440px Arabic: RTL form and no overflow')
    page.close()
    browser.close()

out = ROOT / 'docs/evidence/lhl-guest-source-qa.json'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps({'timestamp':datetime.now(timezone.utc).isoformat(), 'environment':'local browser + synthetic API fixtures',
    'origin':ORIGIN,'source_base':'e681ad026d94a48cab6594ec5b981cec13c7d412','checks':checks,'passed':len(checks),
    'limits':['not production verification','no real payment, provider delivery, auth session or physical stay','Live responses are synthetic']},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'passed':len(checks),'report':str(out)}))
