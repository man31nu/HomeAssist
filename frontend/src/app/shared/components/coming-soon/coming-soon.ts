import { Component } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  template: `
    <div class="coming-soon">
      <span class="icon">🚧</span>
      <h2>Under Construction</h2>
      <p>This feature is currently being built and will be available soon!</p>
    </div>
  `,
  styles: [`
    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      text-align: center;
      color: #666;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ComingSoon {}
