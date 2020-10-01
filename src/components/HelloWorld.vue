<template>
  <div class="hello">
    <b-form-input v-model="newTagName"></b-form-input>
    <b-button variant="primary" @click="addNewTag(newTagName)">Submit</b-button>
    <div class="tag-list">
      <b-button-group v-for="tag in sortedTags" :key="tag">
        <b-button>{{tag}}</b-button>
        <b-button @click="(e) => deleteTag(tag)">X</b-button>
      </b-button-group>
    </div>

    <NoteView :note="currentNote"></NoteView>

    <b-button @click="handleEdit()">New Note</b-button>
    <NoteEdit
      :note="currentNote"
      :tagTree="relationData"
      @finishedEdit="(e)=>updateNote(e)"
      @deleteNote="handleDelete()"
      >
    </NoteEdit>

    <div class="d-flex note-container" v-for="note in sortedNotes" :key="note">
      <div @click="handleView(notes[note])" class="btn btn-secondary w-100">
        {{note}}
      </div>
      <b-button @click="handleEdit(notes[note])">Edit</b-button>
    </div><br>

  </div>
</template>

<script>

import {buildRelation as RelationBuilder} from 'scripts/tagRelationBuilder.js'
import {deleteRelation as RelationDeleter} from 'scripts/tagRelationBuilder.js'
import NoteView from 'components/NoteView.vue'
import NoteEdit from 'components/NoteEdit.vue'

export default {
  name: 'HelloWorld',
  mounted () {
    // window.localStorage.clear()
    if (window.localStorage.tagData == undefined){
      window.localStorage.setItem('tagData', JSON.stringify({}))
    } else {
      this.relationData = JSON.parse(window.localStorage.getItem('tagData'))
    }
    if (window.localStorage.notes == undefined){
      window.localStorage.setItem('notes', JSON.stringify({}))
    } else {
      this.notes = JSON.parse(window.localStorage.getItem('notes'))
    }
  },
  data () {
    return {
      relationData: {},
      notes: {},
      newTagName: '',
      currentNote: {}
    }
  },
  computed: {
    sortedTags () {
      return Object.keys(this.relationData).sort()
    },
    sortedNotes () {
      return Object.keys(this.notes).sort()
    }
  },
  methods: {
    addNewTag (string) {
      if (!Object.prototype.hasOwnProperty.call(this.relationData, string)){
        this.$set(this.relationData, string, {self:0, links:{}})
        window.localStorage.setItem('tagData', JSON.stringify(this.relationData))
      } else {
        console.log('nah son')
      }
    },
    deleteTag (tagName) {
      for (let tag in this.relationData){
        delete this.relationData[tag].links[tagName]
      }
      this.$delete(this.relationData, tagName)
      for (let note in this.notes){
        this.notes[note].tags = this.notes[note].tags.filter(tag => tag != tagName)
      }
      window.localStorage.setItem('tagData', JSON.stringify(this.relationData))
      window.localStorage.setItem('notes', JSON.stringify(this.notes))
    },
    updateNote (note) {
      if (this.notes[note.title]) {
        let removedTags = this.notes[note.title].tags.filter(tag => !note.tags.includes(tag))
        RelationDeleter(note.tags, this.relationData, removedTags)
        this.relationData = Object.assign({}, this.relationData, RelationBuilder(note.tags, this.relationData, this.notes[note.title].tags))
        // note.tags = this.notes[note.title].tags.concat(note.tags)
      } else {
        this.relationData = Object.assign({}, this.relationData, RelationBuilder(note.tags, this.relationData))
      }
      // console.log(note.tags)
      this.$set(this.notes, note.title, note)
      window.localStorage.setItem('notes', JSON.stringify(this.notes))
      window.localStorage.setItem('tagData', JSON.stringify(this.relationData))

    },
    // updateRelationData (tagList, targetObject) {
    //   let payload = RelationBuilder(tagList, targetObject)
    //   window.localStorage.setItem('tagData', JSON.stringify(payload))
    // },
    handleEdit (data) {
      this.$bvModal.show('note-edit')
      if (!data){
        this.currentNote = {title: 'New Note', body: '', tags: []}
      } else {
        this.currentNote = data
      }
    },
    handleDelete () {
      this.$delete(this.notes, this.currentNote.title)
      this.relationData = Object.assign({}, this.relationData, RelationDeleter(this.currentNote.tags, this.relationData))
      window.localStorage.setItem('notes', JSON.stringify(this.notes))
      window.localStorage.setItem('tagData', JSON.stringify(this.relationData))
    },
    handleView (data) {
      this.$bvModal.show('note-view')
      this.currentNote = data
    }
  },
  components: {
    NoteView,
    NoteEdit
  }
}

// Add a check for what changed between the origian version of tags and the submitted to know what relations to delete
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
