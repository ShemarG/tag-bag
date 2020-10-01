<template lang="html">
  <b-modal id="note-edit" :title="note.title" @ok="handleSubmit">
    <div class="modal-container">
      <b-input
        v-model="title"
        placeholder="Add a title for your note"
      ></b-input>
      <b-textarea
        v-model="body"
        placeholder="Add all information here"
      ></b-textarea>
      <b-input v-model="tagSearch"></b-input>
      <div class="tag-results">
        <b-button @click="(e) => addTag(e.target.innerHTML)" v-for="tag in searchResults" :key="tag">{{tag}}</b-button>
      </div>
      <div class="tag-list">
        <span v-if="tags.length == 0">Add a tag and it will show up here!!!</span>
        <span @click="removeTag" class="listed-tag" v-for="tag in tags" :key="tag">{{tag}}</span>
      </div>
      <b-input v-model="newTag"></b-input>
      <b-button @click="createNewTag">New Tag</b-button>
    </div>
    <template v-slot:modal-footer="{ ok, cancel }">
      <div class="custom-footer d-flex justify-content-between w-100">
        <b-button @click="deleteNote()" variant="danger">Delete Note</b-button>
        <div class="safe-buttons">
          <b-button @click="cancel()">Cancel</b-button>
          <b-button @click="ok()" variant="primary">OK</b-button>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>

// The workflow for NoteEdit is as follows:
// Parent component opens the modal and passes in some note data (new notes get empty strings etc.)
// That note data is a prop which is based on a data property in the parent
// Ideally you would want to initially populate the inputs with the existing data from the parent and then update the data
// in this component to match whatever the user inputs, then submit that...
// I couldnt v-model the prop because thats bad practice, so I used refs to just get the values on the "ok" event.

//nvm I used a watcher

export default {
  name: 'NoteEdit',
  data () {
    return {
      newTag: '',
      tagSearch: '',
      title: '',
      body: '',
      tags: []
    }
  },
  computed: {
    searchResults () {
      let tagNames = Object.keys(this.tagTree)
      if (this.tagSearch) {
        let result = tagNames.filter(tags => {
          return tags.substr(0, this.tagSearch.length) == this.tagSearch
        })
        return result
      } else {
        return []
      }
    }
  },
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
  methods: {
    handleSubmit () {
      let payload = {
        title: this.title,
        body: this.body,
        tags: this.tags
      }
      this.$emit('finishedEdit', payload)
    },
    deleteNote () {
      this.$emit('deleteNote')
      this.$bvModal.hide('note-edit')
    },
    addTag (tagName) {
      if (this.tags.indexOf(tagName) == -1){
        this.tags.push(tagName)
      } else {
        console.log("That tag was already added!")
      }
    },
    removeTag (evt) {
      let tagName = evt.target.innerHTML
      console.log(tagName)
      this.tags = this.tags.filter(tag => tag != tagName)
    },
    createNewTag () {
      if (Object.keys(this.tagTree).indexOf(this.newTag) == -1) {
        this.addTag(this.newTag)
      } else {
        console.log('that tag already exists')
      }
    }
  },
  props: {note: Object, tagTree: Object}
}
</script>

<style lang="css" scoped>

</style>
