const trafficLightTemplate = document.createElement("template");
trafficLightTemplate.innerHTML = /* html */ `
<style>
    .red {
        fill: var(--red-bulb-color, red);
    }
    .green {
        fill: var(--green-bulb-color, green);
    }
    .yellow {
        fill: var(--yellow-bulb-color, yellow);
    }
    .rotated {
        transform:
            rotate(90deg) 
            translate(-245px, -570px);
    }
    svg {
        width: var(--width, 48px);
    }
</style>
<div>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0, 0, 145, 312" preserveAspectRatio="true">
    <g id="traffic-light" transform="translate(-250, -250)">
        <g id="enclosure">
            <path d="M276.5,268 L371.5,268 C378.127,268 383.5,273.373 383.5,280 L383.5,542 C383.5,548.627 378.127,554 371.5,554 L276.5,554 C269.873,554 264.5,548.627 264.5,542 L264.5,280 C264.5,273.373 269.873,268 276.5,268 z" fill="#929292"/>
            <path d="M276.5,268 L371.5,268 C378.127,268 383.5,273.373 383.5,280 L383.5,542 C383.5,548.627 378.127,554 371.5,554 L276.5,554 C269.873,554 264.5,548.627 264.5,542 L264.5,280 C264.5,273.373 269.873,268 276.5,268 z" fill-opacity="0" stroke="#7D7D7D" stroke-width="6"/>
        </g>
        <path id="red-bulb" d="M323.5,361 C303.894,361 288,345.106 288,325.5 C288,305.894 303.894,290 323.5,290 C343.106,290 359,305.894 359,325.5 C359,345.106 343.106,361 323.5,361 z" fill="#7D7D7D"/>
        <path id="yellow-bulb" d="M323.5,446 C303.894,446 288,430.106 288,410.5 C288,390.894 303.894,375 323.5,375 C343.106,375 359,390.894 359,410.5 C359,430.106 343.106,446 323.5,446 z" fill="#7D7D7D"/>
        <path id="green-bulb" d="M323.5,530 C303.894,530 288,514.106 288,494.5 C288,474.894 303.894,459 323.5,459 C343.106,459 359,474.894 359,494.5 C359,514.106 343.106,530 323.5,530 z" fill="#7D7D7D"/>
    </g>
</svg>
</div>
`;

interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class TrafficLight extends HTMLElement {
    readonly _bulbs:string[] = ["red", "yellow", "green", "off"];
    // our default viewBox for the SVG element
    readonly _defViewBox:ViewBox = { x: 0, y: 0, width: 145, height: 312};

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set light(value: string) {
        this.setAttribute('light', value);
    }

    get light(): string {
        return this.getAttribute('light') || "";
    }

    set rotated(value: boolean) {
        if (value) {
            this.setAttribute('rotated', "true");
        } else {
            this.removeAttribute('rotated');
        }
    }

    get rotated(): boolean {
        const value = this.getAttribute('rotated');
        return !(value == null && value == undefined);
    }

    connectedCallback(): void {
        this.shadowRoot?.appendChild(trafficLightTemplate.content.cloneNode(true));

        this._changeLight(this.light);
        this._rotate();
    }

    static get observedAttributes(): Array<string> {
        return ['light', 'rotated'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue == newValue) {
            return;
        }

        if ('light' == name) {
            this._changeLight(newValue);
        }

        if ('rotated' == name) {
            this._rotate();
        }
    }

    _rotate(): void {
        if (this.rotated) {
            this.shadowRoot?.querySelector<HTMLElement>('#traffic-light')?.setAttributeNS(null, 'class', 'rotated');
            this.shadowRoot?.querySelector<HTMLElement>('svg')?.setAttributeNS(null, 'viewBox', `${this._defViewBox.x} ${this._defViewBox.y} ${this._defViewBox.height} ${this._defViewBox.width}`);
        } else {
            this.shadowRoot?.querySelector<HTMLElement>('#traffic-light')?.removeAttributeNS(null, 'class');
            this.shadowRoot?.querySelector<HTMLElement>('svg')?.setAttributeNS(null, 'viewBox', `${this._defViewBox.x} ${this._defViewBox.y} ${this._defViewBox.width} ${this._defViewBox.height}`);
        }
    }

    _changeLight(value: string): void {
        // remove classes on all other elements
        this._bulbs.forEach(bulb => {
            this.shadowRoot?.querySelector<HTMLElement>(`path#${bulb.toLowerCase()}-bulb`)?.removeAttributeNS(null, 'class');
        });

        const current: string = value.toLowerCase();
        this.shadowRoot?.querySelector<HTMLElement>(`path#${current}-bulb`)?.setAttributeNS(null, 'class', current);
    }
}

window.customElements.define('traffic-light', TrafficLight);