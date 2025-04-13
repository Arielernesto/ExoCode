import { ApolloClient, InMemoryCache, gql, type DocumentNode } from '@apollo/client/core'
import { type MaybeMasked } from '@apollo/client'
import useStore from 'store/auth'

// Configuración del cliente Apollo
const client = new ApolloClient({
    uri: `${import.meta.env.PUBLIC_API_URL}/api`,
    credentials: "include",
    cache: new InMemoryCache()
})

interface QueryResult<T> {
    loading: boolean
    error: Error | null
    data: MaybeMasked<T> | null
    refetch: (variables?: Record<string, any>) => Promise<void>
}

interface MutateResult<T> {
    loading: boolean
    error: Error | null
    data: MaybeMasked<T> | null | undefined
}

const loadingEvent = new CustomEvent('loading', {
    detail: { state: true}
})

const unloadingEvent = new CustomEvent('unloading', {
    detail: { state: false}
})





const  Query = async <T>(query: DocumentNode, variables: Record<string, any> = {}): Promise<QueryResult<T>> => {
    let loading = true
    document.dispatchEvent(loadingEvent)
    let error: Error | null = null
    let data: MaybeMasked<T> | null = null

    const fetchQuery = async (variables: Record<string, any>) => {
        try {
            const response = await client.query<T>({
                query,
                variables
            })
            data = response.data
            error = null
        } catch (e) {
            error = e as Error
            data = null
        } finally {
            loading = false
            document.dispatchEvent(unloadingEvent)
        }
    }
    await fetchQuery(variables)

    const refetch = async (newVariables: Record<string, any> = variables) => {
        loading = true
        document.dispatchEvent(loadingEvent)
        await fetchQuery(newVariables)
    }

    return {
        get loading(){
            return loading
        },
        get error(){
            return error
        },
        get data(){
            return data
        },
        refetch
    }
}


const Mutate = async <T>(mutation: DocumentNode, variables: Record<string, any> = {}): Promise<MutateResult<T>> => {
    let loading = true
    window.dispatchEvent(loadingEvent)
    let error: Error | null = null
    let data: MaybeMasked<T> | null | undefined = null

    const fetchQuery = async (variables: Record<string, any>) => {
        try {
            const response = await client.mutate<T>({
                mutation,
                variables
            })
            data = response.data
            error = null
        } catch (e) {
            error = e as Error
            data = null
        } finally {
            loading = false
            window.dispatchEvent(unloadingEvent)
        }
    }
    await fetchQuery(variables)

    return {
        get loading(){
            return loading
        },
        get error(){
            return error
        },
        get data(){
            return data
        }
    }
}


export { Query, Mutate, loadingEvent, unloadingEvent }