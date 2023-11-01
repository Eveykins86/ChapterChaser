const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        // Await the result of the query to the database
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      try {
        // Create a new user using the provided args
        const user = await User.create(args);

        // Sign a token for the newly created user
        const token = signToken(user);

        // Return the user and token
        return { token, user };
      } catch (err) {
        console.error(err);
        // Handle errors appropriately, such as returning an error message
        throw new Error('Could not create user');
      }
    },
    login: async (parent, { email, password }) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If the user doesn't exist, throw an AuthenticationError
        if (!user) {
          throw new AuthenticationError('Invalid credentials');
        }

        // Check if the provided password is correct
        const correctPw = await user.isCorrectPassword(password);

        // If the password is incorrect, throw an AuthenticationError
        if (!correctPw) {
          throw new AuthenticationError('Invalid credentials');
        }

        // Sign a token for the authenticated user
        const token = signToken(user);

        // Return the token and user
        return { token, user };
      } catch (err) {
        console.error(err);
        // Handle errors appropriately, such as returning an error message
        throw new Error('Login failed');
      }
    },

    saveBook: async (parent, { bookInput }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookInput } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          throw new Error('Could not save the book.');
        }
      } else {
        throw new AuthenticationError('You need to be logged in to save a book.');
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          throw new Error('Could not remove the book.');
        }
      } else {
        throw new AuthenticationError('You need to be logged in to remove a book.');
      }
    },
  },
};

module.exports = resolvers;