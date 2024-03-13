let mainCursor;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
	try {
		return window.getComputedStyle ? window.getComputedStyle(el)[attr] : el.currentStyle[attr];
	} catch (e) {
		console.error(e);
	}
	return false;
};

const cursorInit = () => {
	mainCursor = new Cursor();
	return mainCursor;
};
const getmainCursor = () => {
	return mainCursor;
};

class Cursor {
	constructor() {
		this.pos = {
			curr: null,
			prev: null,
		};
		this.pt = [];
		this.create();
		this.init();
		this.render();
	}

	move(left, top) {
		this.cursor.style["left"] = `${left}px`;
		this.cursor.style["top"] = `${top}px`;
	}

	create() {
		if (!this.cursor) {
			this.cursor = document.createElement("div");
			this.cursor.id = "cursor";
			this.cursor.classList.add("xs-hidden");
			this.cursor.classList.add("hidden");
			// document.body.append(this.cursor);
		}

		var el = document.getElementsByTagName("*");
		for (let i = 0; i < el.length; i++) {
			if (getStyle(el[i], "cursor") == "pointer") this.pt.push(el[i].outerHTML);
		}

		this.setCursor();
	}

	// 设置鼠标指针外观
	setCursor() {
		if (this.scr) this.scr.remove();
		nextTick(() => {
			const data = JSON.parse(window.localStorage.getItem("data"));
			const cursorId = data.cursorId.split("-");
			document.body.appendChild((this.scr = document.createElement("style")));
			this.scr.innerHTML = `* {cursor: url("/images/cursor/${data.cursorTab}/${cursorId[0]}/${cursorId[1]}.ico"), auto !important}`;
		});
	}

	refresh() {
		this.cursor.classList.remove("active");
		this.pos = {
			curr: null,
			prev: null,
		};
		this.pt = [];

		this.create();
		this.init();
		this.render();
	}

	init() {
		document.onmousemove = (e) => {
			this.pos.curr == null && this.move(e.clientX - 8, e.clientY - 8);
			this.pos.curr = {
				x: e.clientX - 8,
				y: e.clientY - 8,
			};
			this.cursor.classList.remove("hidden");
		};
		document.onmouseenter = () => this.cursor.classList.remove("hidden");
		document.onmouseleave = () => this.cursor.classList.add("hidden");
		document.onmousedown = () => this.cursor.classList.add("active");
		document.onmouseup = () => this.cursor.classList.remove("active");
	}

	render() {
		if (this.pos.prev) {
			this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
			this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
			this.move(this.pos.prev.x, this.pos.prev.y);
		} else {
			this.pos.prev = this.pos.curr;
		}
		requestAnimationFrame(() => this.render());
	}
}

export { cursorInit, getmainCursor };
