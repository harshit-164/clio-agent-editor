import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>🚀 Hello from VibeCode!</h1>
      <p>Your Angular app is running successfully.</p>
      <p>Edit <code>src/app/app.component.ts</code> to get started.</p>
    </div>
  `,
    styles: [`
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
  `]
})
export class AppComponent {
    title = 'angular-starter';
}
