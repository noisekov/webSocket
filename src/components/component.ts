export default class Component {
    #children: Component[] = [];
    #node: HTMLElement;
    listeners: { [key: string]: EventListener };

    constructor(
        { tag = 'div', className = '', text = '', id = '' },
        ...children: Component[]
    ) {
        const node = document.createElement(tag);
        node.className = className;
        node.id = id;
        node.textContent = text;
        this.#node = node;
        this.listeners = {};

        if (children) {
            this.appendChildren(children);
        }
    }

    append(child: Component) {
        this.#children.push(child);
        this.#node.append(child.getNode());
    }

    appendChildren(children: Component[]) {
        children.forEach((el) => {
            this.append(el);
        });
    }

    getNode() {
        return this.#node;
    }

    getChildren() {
        return this.#children;
    }

    setTextContent(content: string) {
        this.#node.textContent = content;
    }

    setAttribute(attribute: string, value: string) {
        this.#node.setAttribute(attribute, value);
    }

    removeAttribute(attribute: string) {
        this.#node.removeAttribute(attribute);
    }

    addClass(className: string) {
        this.#node.classList.add(className);
    }

    hasClass(className: string) {
        return this.#node.classList.contains(className);
    }

    toggleClass(className: string) {
        this.#node.classList.toggle(className);
    }

    removeClass(...className: string[]) {
        this.#node.classList.remove(...className);
    }

    addListener(
        event: string,
        listener: EventListener,
        options: boolean | AddEventListenerOptions = false
    ) {
        this.listeners.event = listener;
        this.#node.addEventListener(event, listener, options);
    }

    removeListener(
        event: string,
        listener: EventListener,
        options: boolean | AddEventListenerOptions = false
    ) {
        this.#node.removeEventListener(event, listener, options);
    }

    destroyChildren() {
        this.#children.forEach((child) => {
            child.destroy();
        });
        this.#children.length = 0;
    }

    destroy() {
        Object.entries(this.listeners).forEach(([event, listener]) => {
            this.removeListener(event, listener);
        });
        this.destroyChildren();
        this.#node.remove();
    }
}
