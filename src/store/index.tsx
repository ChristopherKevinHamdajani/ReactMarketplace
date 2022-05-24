import create from 'zustand';
interface UserState {
    userLoggedIn: UserLoggedIn;
    setUser: (user: UserLoggedIn) => void;
    removeUser: () => void;
}

const getLocalStorageUser = (key: string): UserLoggedIn => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorageUser = (key: string, value:UserLoggedIn) =>   window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<UserState>(set=> ({
    userLoggedIn: getLocalStorageUser('userLoggedIn'),
    setUser: (user: UserLoggedIn) => set((state) => {
        setLocalStorageUser('userLoggedIn', user)
    }),
    removeUser: () => (() => {
        const blankUser = {"userId": -1,"token":''}
        setLocalStorageUser('user', blankUser)
    })
}))
export const useUserStore = useStore;
