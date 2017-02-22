/* jshint esnext: true */

const itemNode = (d) => { return d && d.length ? `<item>${d}</item>` : ''; };

class BookmarkItemPrivate {

  constructor() {
    this.state = new StateManager(this.afterStateChange.bind(this));
    this.state.setInitial({data: undefined});
    this.bound = ['onLinkClick'].reduce((acc, d) => { acc[d] = this[d].bind(this); return acc; }, {});
  }

  // --------------------
  // Public Accessors
  // --------------------

  setData(_) { this.state.set({data: _}); }

  // --------------------
  // Flow
  // --------------------
  onLinkClick(e) {
      var type = e.target.dataset.src;
      if(type) {
        var idx = e.target.dataset.idx;
        var {src} = this.state.get().data;
        // if(type === 'gist')   { src = 'http://gist.github.com/' + src; }
        window.open(src, '_blank');
      }
  }

  // --------------------
  // Dealing with state change
  // --------------------

  afterStateChange(k, v, oldV) {
    if(k === 'data') {
      this.updateView();
    }
  }



  // --------------------
  // Create Element
  // --------------------

  createElement() {
    let node = document.createElement('bookmark-item');
    node.addEventListener('click', this.bound.onLinkClick);
    this.mountNode = node;
    return this.mountNode;
  }

  updateView() {
    const {data} = this.state.get();
    if(data === undefined) { node.innerHTML = ''; return; }

    var node = this.mountNode;
    var tags   = data.tags.map(itemNode).join(' ');
    var terms  = data.terms.map(itemNode).join(' ');
    var others = data.others.map(itemNode).join(' ');
    var name = data.name;


    const fmt = data.fmt;
    let thumbPath = 'etc/snapshots/-no-pict.png';
    if (3 === 4 && fmt && fmt.indexOf('gst') !== -1) {
      thumbPath = `https://gist.githubusercontent.com/${data.src}/raw/thumbnail.png`;
    } else if (fmt && fmt.indexOf('s') !== -1) {
      thumbPath = `etc/snapshots/${data.src.replace('/','-')}.png`;
    }

    var   blockLinks =  `<div>
    <span data-src="gist">source</span>
    </div><div><span>${name}</span></div>
    `;
    node.innerHTML = `
    <div class="preview">
    <div class="thumb"><img data-path="${thumbPath}" src="${thumbPath}" alt="svg"></div>
    <div class="links">${blockLinks}</div>
    </div>
    <div class="desc">
    <div class="tagged tags">${tags}</div>
    <div class="tagged terms">${terms}</div>
    <div class="tagged others">${others}</div>
    </div>`;
  }

  // --------------------
  // Destroy Element
  // --------------------

  destroyElement() {
    // cleanup and remove any event listener
  }

}

/**
 * Public interface
 */
class BookmarkItem {
  constructor(props) { this.__private = new BookmarkItemPrivate(props); }
  setData(...args) { return this.__private.setData(...args); }
  createElement() { return this.__private.createElement(); }
  destroyElement() { return this.__private.destroyElement(); }
}
