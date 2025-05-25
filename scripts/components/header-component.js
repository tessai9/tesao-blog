class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        header {
          display: flex;
          align-items: center;
          padding: 1em;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        .title {
          flex-grow: 1;
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
        }
      </style>
      <header>
        <div class="title">Tesao blog</div>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
