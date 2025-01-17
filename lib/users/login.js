/* eslint-disable consistent-return */

import _ from "lodash";
import { login as loginMutation } from "../../graphql/mutations/Users.gql";
import client from "../../graphql/client";
import formatErrorString from "../formatErrorString";

const handleLoginRequest = async (emailAddress = null, password = null) => {
  try {
    return client
      .mutate({
        mutation: loginMutation,
        variables: { emailAddress, password },
      })
      .then(({ errors, data }) => {
        if (errors && errors.length > 0) {
          throw new Error(errors[0].message);
        } else {
          return _.get(data, "login", null);
        }
      });
  } catch (exception) {
    throw new Error(
      formatErrorString("loginWithPassword.handleLoginRequest", exception)
    );
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.emailAddress)
      throw new Error("options.emailAddress is required.");
    if (!options.password) throw new Error("options.password is required.");
  } catch (exception) {
    throw new Error(
      formatErrorString("loginWithPassword.validateOptions", exception)
    );
  }
};

const handleLoginWithPassword = async (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    const user = await handleLoginRequest(
      options.emailAddress,
      options.password
    );

    resolve(user);
  } catch (exception) {
    reject(formatErrorString("loginWithPassword", exception));
  }
};

const loginWithPassword = (options) =>
  new Promise((resolve, reject) => {
    handleLoginWithPassword(options, { resolve, reject });
  });

export default loginWithPassword;
