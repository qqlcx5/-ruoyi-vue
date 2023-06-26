import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Expand',
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  // proxy: getCurrentInstance(),
  render() {
    return this.$props.column.render(this.$props)
  }
})
