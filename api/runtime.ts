// Vercel Node runtime entrypoint.
// Importing the existing server starts the Express listener; Vercel captures
// Node HTTP servers created through listen(), so production uses the same
// authenticated API implementation as local/qualified runtime.
import '../server';
