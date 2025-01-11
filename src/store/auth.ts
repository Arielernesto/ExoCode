import { create } from 'zustand';
import { Query, loadingEvent, unloadingEvent } from 'lib/apollo-client';
import { AUTHORIZE } from 'queries/auth';

interface State {
  loading: boolean;
  setLoading: (el: boolean) => void;
  authorize: () => void;
  auth: {
    username: string
    lastname: string
    password: string
    email: string
  } | null
  setAuth: (user: any) => void;
}

const useStore = create<State>((set, get) => ({
  loading: false,
  setLoading: (el) => set({ loading: el }),
  authorize: async () => {
    const pet = await fetch("http://localhost:4000/api", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: AUTHORIZE }),
      method: "post"
    })
    const data = await pet.json()
    set({ auth: data})
    dispatchEvent(unloadingEvent)

  },
  auth: null,
  setAuth: (user: any)  => set({ auth: user })

}));

export default useStore;
