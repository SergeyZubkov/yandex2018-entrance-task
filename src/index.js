import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import "react-responsive-modal/styles.css";
import { ModalProvider } from 'react-modal-hook';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  makeVar,
} from "@apollo/client";
import workingHours from "./utils/workingHours";
import { TransitionGroup } from "react-transition-group";

export const pickedDateStartVar = makeVar(workingHours.getCorrectDate());

export const pickedRoomVar = makeVar(null);

const client = new ApolloClient({
  uri: "http://45.141.78.194:3060/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Event: {
        fields: {
          dateStart: {
            read(dateISO) {
              return new Date(dateISO);
            },
          },
          dateEnd: {
            read(dateISO) {
              return new Date(dateISO);
            },
          },
        },
      },
    },
  }),
  connectToDevTools: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ModalProvider rootComponent={TransitionGroup}>
        <App />
      </ModalProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
