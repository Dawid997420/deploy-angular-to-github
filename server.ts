import express, { Request, Response } from 'express';
import { join } from 'path';
import { app as ngApp } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';

const server = express();
const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/hoffmanshop-ang/browser');

server.get('*.*', express.static(DIST_FOLDER, { maxAge: '1y' }));

server.get('*', async (req: Request, res: Response) => {
  const application = await ngApp();
  res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Node Express server listening on http://0.0.0.0:${PORT}`);
});
