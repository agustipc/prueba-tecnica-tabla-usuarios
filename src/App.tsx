import { useEffect, useState, useRef, useMemo } from 'react'
import { SortBy, type User } from './types.d'
import './App.css'
import { UsersList } from './components/UsersList'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }
  const toggleSortByCountry = () => {
    setSorting(sorting !== SortBy.COUNTRY ? SortBy.COUNTRY : SortBy.NONE)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    if (sort === sorting) { setSorting(SortBy.NONE); return }
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(data => {
        setUsers(data.results)
        originalUsers.current = data.results
      })
      .catch(err => { console.log(err) })
  }, [])

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    switch (sorting) {
      case SortBy.FIRST_NAME:
        return filteredUsers.toSorted((a, b) => {
          return a.name.first.localeCompare(b.name.first)
        })
      case SortBy.LAST_NAME:
        return filteredUsers.toSorted((a, b) => {
          return a.name.last.localeCompare(b.name.last)
        })
      case SortBy.COUNTRY:
        return filteredUsers.toSorted((a, b) => {
          return a.location.country.localeCompare(b.location.country)
        })
      default:
        return filteredUsers
    }
  }, [filteredUsers, sorting])

  return (
    <>
      <h1>React App</h1>
      <header>
        <button onClick={toggleColors}>Colorear Filas</button>
        <button onClick={toggleSortByCountry}>{sorting === SortBy.COUNTRY ? 'No Ordenar por País' : 'Ordenar por País'}</button>
        <button onClick={handleReset}>Resetear</button>
        <input type="text" placeholder='Filtra por país...' onChange={(e) => { setFilterCountry(e.target.value) }} />
      </header>
      <main>
        <UsersList handleSort={handleChangeSort} handleDelete={handleDelete} users={sortedUsers} showColors={showColors}/>
      </main>
    </>
  )
}

export default App
