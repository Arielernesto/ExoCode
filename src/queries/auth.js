import { gql } from '@apollo/client/core'

export const REGISTER_MUTATION = gql`
    mutation createUser(
            $username: String!,
            $lastname: String!,
            $password: String!,
            $email: String!
    ){
        createUser(
            username: $username,
            lastname: $lastname,
            password: $password,
            email: $email
        ) {
            token    
        }
    }
`

export const LOGIN_MUTATION = gql`
    mutation login(
        $email: String!,
        $password: String!
    ){
        login(
            email: $email,
            password: $password  
        ){
            token    
        }
    }
`

export const AUTHORIZE = `
    query {
        authorize {
            username
            lastname
            id
            email
            rol {
                role
                job
                permissions
            }
        }
    }
`