import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from 'next-auth/providers/credentials'
import { dbUsers } from "../../../database";

//... (los 3 puntos en el nombre ) significa que cualquier peticion que se haga a
// api --> auth va a caer en este archivo.





export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
        name: 'Custom Login',
        credentials:{
            email: { label: 'Correo:', type:'email', placeholder:'correo@mail.com'},
            password: { label: 'Contraseña:', type:'password', placeholder:'contraseña'},
        },
        async authorize (credentials) {
            return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
         }
    }),

    // ... github
    GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
  ],

  //Custom Pages:
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

//Session duration
  session: {
    maxAge: 2592000, //30dias
    strategy: 'jwt',
    updateAge: 86400 // cada dia
  },


  //Callbacks:
  callbacks: {
    async jwt({ token, account, user }){
        // console.log({ token, account, user })

        if ( account ) {
            token.accessToken= account.access_token;

            switch ( account.type ) {

                case 'oauth':
                    token.user = await dbUsers.oAuthToDBUser( user?.email || '', user?.name || '');

                case 'credentials':
                    token.user = user
                break;
            }
        }

        return token;
    },

    async session({ session, token, user }){
        // console.log({ session, token, user })
        
        session.accessToken= token.accessToken;
        session.user = token.user as any;

        return session;
    }

  }
});