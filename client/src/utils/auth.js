// use this to decode a token and get the user's information out of it
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import decode from 'jwt-decode';

class AuthService {
  constructor() {
    this.client = new ApolloClient({
      link: this.createAuthLink(),
      cache: new InMemoryCache(),
    });
  }

  // Decode the token to retrieve user data
  getProfile() {
    const token = this.getToken();
    if (token) {
      return decode(token);
    }
    return null;
  }

  // Check if a user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if a token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  // Get the token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Set the token to localStorage and update Apollo Client cache
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    // You should also update the Apollo Client cache with user data here.
  }

  // Clear the token from localStorage and update Apollo Client cache
  logout() {
    localStorage.removeItem('id_token');
    // You should also clear the Apollo Client cache here.
  }

  // Create an Apollo Link for authentication
  createAuthLink() {
    const httpLink = createHttpLink({
      // Your GraphQL server URL goes here
      uri: 'http://localhost:3001/graphql',
    });

    const authLink = setContext((_, { headers }) => {
      // Get the token from localStorage
      const token = this.getToken();

      // Add the token to the headers if it exists
      if (token) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      }

      return {
        headers,
      };
    });

    return authLink.concat(httpLink);
  }
}

export default new AuthService();
