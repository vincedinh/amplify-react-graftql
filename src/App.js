import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css"
import { API } from "aws-amplify";

import {
  withAuthenticator,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  View,
  Card,
  TextField,
} from "@aws-amplify/ui-react";

import { listTodos as listNotes } from "./graphql/queries";
import {
  createTodo as createNoteMutation,
  deleteTodo as deleteNoteMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    fetchNotes();
  }, []);

async function fetchNotes() {
  const apiData = await API.graphql({ query: listNotes });
  const notesFromAPI = apiData.data.listTodos.items;
  setNotes(notesFromAPI);
}

async function createNote(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const data = {
    name: form.get("name"),
    description: form.get("description"),
  }
  await API.graphql({
    query: createNoteMutation,
    variables: { input: data },
  });
  fetchNotes();
  event.target.reset();
}

async function deleteNote({id}) {
  const newNotes = notes.filter((note) => note.id !== id);
  setNotes(newNotes)
  await API.graphql({
    query: deleteNoteMutation,
    variables: { input: { id }},
  });
}

return (
  <View className="App">
    <Heading level={1}>My Notes App</Heading>
    <View as="form" margin="3rem 0" onSubmit={createNote}>
      <Flex direction="row" justifyContent="center">
        <TextField 
        name="name"
        placeholder="Note Name"
        label="Note Name"
        labelHidden
        variation="quiet"
        required
        />
        <TextField
        name="description"
        placeholder="Note Description"
        label="Note Description"
        labelHidden
        variation="quiet"
        required
        />
        <Button type="submit" variation="primary">
          Create Note
        </Button>
      </Flex>
    </View>
    <View margin="3rem 0">
      {notes.map((note) => {
        <Flex key={note.id || note.name}
        direction = "row"
        justifyContent="center"
        alignItems="center"
        >
          <Text as="strong" fontWeight={700}>
            {note.name}
          </Text>
          <Text as="span">{note.description}</Text>
          <Button variation="link" onClick={()=>deleteNote(note)}>
            Delete Note
          </Button>
        </Flex>
      })}
    </View>
  </View>
)

}

export default withAuthenticator(App);