import { SortBy, type User } from '../types.d'

interface Props {
  handleDelete: (uuid: string) => void
  handleSort: (sort: SortBy) => void
  users: User[]
  showColors: boolean
}

export function UsersList ({ handleSort, handleDelete, users, showColors }: Props) {
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='pointer' onClick={() => { handleSort(SortBy.FIRST_NAME) }}>Nombre</th>
          <th className='pointer' onClick={() => { handleSort(SortBy.LAST_NAME) }}>Apellido</th>
          <th className='pointer' onClick={() => { handleSort(SortBy.COUNTRY) }}>Pais</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? '#333' : '#555'
          const color = showColors ? backgroundColor : 'transparent'

          return (
            <tr key={user.login.uuid} style={{ backgroundColor: color }}>
              <td>
                <img src={user.picture.thumbnail} alt={user.name.first} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => { handleDelete(user.login.uuid) }}>Delete</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
