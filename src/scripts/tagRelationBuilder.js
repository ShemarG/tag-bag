// This function checks our dictionary to see if any submitted tags are new, if they are, initialize them.
// If there are existing tags in a relation, you'd want to initialize as 1, pass in an array of them as "existing"
let updateDictionary = (array, object, existing) => {
  array.forEach(item => {
    if (!Object.prototype.hasOwnProperty.call(object, item)) {
      object[item] = {self:0, links: {}}
      if (existing.length != 0) {
        existing.forEach(existing_tag  => {
          object[item].links[existing_tag] = 1
        })
      }
    }
  })
}

// So this function takes an object and an array.
// It checks the object to see if it has a property corresponding with each item in the array.
// If it doesnt, add it and initialize it at 1. If it does, increment by 1.
// The function also accepts an "exclude" which is a list of object properties that wont be considered.
let countLinks = (array, object, exclude) => {
  array.forEach(item => {
    // console.log(`Item: ${item}, Exclusion: ${exclude}`)
    if (!exclude.includes(item)) {
      if (!Object.prototype.hasOwnProperty.call(object, item)) {
        // console.log(`Added 1 to ${item}`)
        object[item] = 1
      } else {
        object[item]++
      }
    }
  })
}

// buildRelation puts the two above functions together
let buildRelation = (array, object, exclude = []) => {
  updateDictionary(array, object, exclude)
  array.forEach(tag => {
    exclude.push(tag)
    // console.log(exclude, tag)
    countLinks(array, object[tag].links, exclude)
    exclude.pop()
    if (!exclude.includes(tag)) {
      object[tag].self++
    }
  })
  return object
}

// This takes in a array of previously associated tags and an object of tag relations
// It loops through the array and for each item, it reduces "self" and each relation between the other members of the array by one.
// If a relation hits zero, it gets deleted. If self hits zero, the dictionary removes the tag.
// If 'specific' is passed, only those relations will be subtracted from the array.
let deleteRelation = (array, object, specific) => {

  if (specific) {
    specific.forEach(item => {
      let dictionary = object[item]
      dictionary.self--
      array.forEach(remaining_tag => {
        object[remaining_tag].links[item]--
        if (object[remaining_tag].links[item] == 0) {
          delete object[remaining_tag].links[item]
        }
      })
      if (dictionary.self == 0) {
        delete object[item]
      }
    })
  } else {
    array.forEach(item => {
      let dictionary = object[item]
      dictionary.self--
      for (let link in dictionary.links) {
        if (array.includes(link)) {
          dictionary.links[link]--
          if (dictionary.links[link] == 0) {
            delete dictionary.links[link]
          }
        }
      }
      if (dictionary.self == 0) {
        delete object[item]
      }
    })
  }
  return object
}

export {buildRelation, deleteRelation}
