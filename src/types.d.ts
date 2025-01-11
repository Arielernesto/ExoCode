interface ApolloError {
    message: string
    code: string
    path?: string
    extensions?: {
        [key: string]: any
    }
}