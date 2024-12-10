import './App.css';
import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

interface RocketData {
  id: string;
  name: string;
  wikipedia: string;
  description: string
}

interface RocketsResult {
  rockets: Array<RocketData>
}

const ROCKETS = gql`
  query GetRockets {
    rockets {
      id
      name
      wikipedia
      description
    }
  }
`;

const ADD_USER = gql`
  mutation InsertUser($name: String!) {
    insert_users(objects: { name: $name }) {
      returning {
        id
        name
      }
    }
  }
`;

interface UserDetails {
  id: string;
  name: string;
}

interface AddUserResponse {
  returning: Array<UserDetails>;
}

function App() {
  const { loading, error, data } = useQuery<RocketsResult>(ROCKETS);
  const [name, setName] = useState('');

  const [addUser, { data: userData }] = useMutation<
    { insert_users: AddUserResponse }
  >(ADD_USER);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  async function handleOnSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addUser({ variables: { name }});
    setName('');
  }

  console.log(userData);

  return (
    <>
      <div>
        <h1>SpaceX Rockets</h1>
        {loading || !data ? <p>Loading...</p> :
          data.rockets.map(rocket => (
            <div key={rocket.id}>
              <h2><a href={rocket.wikipedia}>{rocket.name}</a></h2>
              <p>{rocket.description}</p>
            </div>
          ))
        }
      </div>
      <div>
        <h1>Users</h1>
        <form onSubmit={handleOnSubmit}>
          <label htmlFor="username">Name: </label>
          <input required name="username" type="text" onChange={handleOnChange} value={name} autoComplete="off"/>
          <button type="submit">Add User</button>
          <p>
            New User ID: {userData && userData.insert_users.returning[0].id}
          </p>
        </form>
      </div>
    </>
  );
}

export default App;
