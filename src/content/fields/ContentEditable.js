import rangy from 'rangy/lib/rangy-selectionsaverestore.js'
import Field from './Field'

class ContentEditable extends Field {
  getText() {
    return this.$element[0].textContent
  }

  persistSelection() {
    let selection = rangy.getSelection()
    if (selection.rangeCount > 0) {
      this.range = rangy.getSelection().getRangeAt(0)
    } else {
      let range = rangy.createRange()
      range.selectNodeContents(this.$element.get(0))
      range.collapse(false)
      this.range = range
    }
  }

  removeCommand(match) {
    super.removeCommand()

    let range = this.range
    let container = range.startContainer.closest ? range.startContainer : range.startContainer.parentElement
    let query = container.closest('.atwho-query') ||
              container.querySelector('.atwho-query') ||
              container.querySelector('.atwho-inserted') ||
              container.querySelector('.atwho-inserted')

    range.selectNode(query)
    range.deleteContents()
  }

  insertText(text) {
    let node = document.createTextNode(text)
    this.insertNode(node)
  }

  focus() {
    this.range.select()
    this.range.collapse(false)
    this.range.select()
  }

  blur() {
    this.$element.blur()
  }

  insertNode(node) {
    this.range.insertNode(node)
    this.range.setEndAfter(node)
    this.focus()
    this.blur()
  }

  replaceText(find, replace) {
    let element = this.$element[0]
    let selection = rangy.saveSelection()
    element.innerHTML = element.innerHTML.replace(find, replace)
    rangy.restoreSelection(selection)
  }

  setText(text) {
    return this.$element[0].innerHTML = text
  }
}

export default ContentEditable
