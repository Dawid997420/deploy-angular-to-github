import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
    path: '',               // Strona główna
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about',          // Strony statyczne możesz prerenderować
    renderMode: RenderMode.Prerender
  },
  {
    path: 'polityka-prywatnosci',
    renderMode: RenderMode.Prerender
  },

  {
    path: 'promocje',
    renderMode: RenderMode.Prerender
  },

  {
    path: 'regulamin',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'kontakt',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'product/:id',    // Dynamiczny SSR dla produktów
    renderMode: RenderMode.Server
  },

  {
    path: 'dostawa-i-platnosc',
    renderMode: RenderMode.Server
  },

  {
    path: 'category/:name',    // Dynamiczny SSR dla produktów
    renderMode: RenderMode.Server
  },

  {
    path: 'category/:name/:subname',
    renderMode: RenderMode.Server
  },

  {
    path: '**',
    renderMode: RenderMode.Server
  },
   
];
