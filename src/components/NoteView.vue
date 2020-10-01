<template lang="html">
  <b-modal id="note-view" :title="note.title">
    <div class="modal-container">
      <span class="note-body">{{note.body}}</span>
      <div class="tag-list">
        <span class="listed-tag" v-for="tag in note.tags" :key="tag">{{tag}}</span>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'NoteView',
  props: {note: Object},
  watch: {
    note: {
      deep: true,
      handler: function (newVal) {
        newVal = JSON.parse(JSON.stringify(newVal))
        this.title = newVal.title,
        this.body = newVal.body,
        this.tags = newVal.tags
      }
    }
  },
}
</script>

<style lang="css" scoped>
</style>
