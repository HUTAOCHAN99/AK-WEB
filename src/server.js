require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const server = http.createServer(async (req, res) => {
  // Proteksi route admin
  if (req.url === '/admin-dashboard.html') {
    try {
      // Verifikasi session dari cookie atau header
      const token = req.headers['authorization']?.split(' ')[1];
      
      if (!token) {
        res.writeHead(302, { 'Location': '/auth.html' });
        res.end();
        return;
      }
      
      // Verifikasi token dengan Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        res.writeHead(302, { 'Location': '/auth.html' });
        res.end();
        return;
      }
      
      // Verifikasi role admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', user.id)
        .single();
      
      if (profileError || profile.role !== 'admin' || !profile.is_approved) {
        res.writeHead(302, { 'Location': '/auth.html' });
        res.end();
        return;
      }
      
      // Jika lolos verifikasi, lanjutkan serve file
      serveFile(res, './admin-dashboard.html', 'text/html');
      return;
    } catch (err) {
      res.writeHead(302, { 'Location': '/auth.html' });
      res.end();
      return;
    }
  }

  // Serve file statis
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';
  serveFile(res, filePath, contentType);
});

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});