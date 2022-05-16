import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Group,
  TextInput,
  NumberInput,
  Select,
  Text,
  useMantineTheme,
  MantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import EditItem from './EditItem'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [opened, setOpened] = useState(false)
  const [openedEdit, setOpenedEdit] = useState(false)
  const [currentEditValue, setCurrentEditValue] = useState({})
  const [image, setImage] = useState({})
  const theme = useMantineTheme()

  const form = useForm({
    initialValues: {
      name: '',
      quantity: '',
      location: '',
      price: '',
    },

    validate: {
      name: (value) => (value.length < 1 ? 'Required' : null),
    },
  })
  function loadItems() {
    fetch('/items')
      .then((res) => res.json())
      .then((items) => {
        // console.log(items)
        setItems(items)
      })
      .catch((e) => {
        alert('something went wrong')
      })
  }

  useEffect(() => {
    loadItems()
    return () => {}
  }, [])

  const rows = items.map((element) => (
    <tr key={element.id}>
      <td>
        {element.image.length > 0 && (
          <img src={'/get-image/' + element.image} className="image" />
        )}
      </td>
      <td>{element.name}</td>
      <td>{element.location}</td>
      <td>{element.weather && element.weather[0].description}</td>
      <td>{element.quantity}</td>
      <td>{element.price}</td>
      {/* <td><Button>add</Button></td> */}
      <td>
        <Button
          size="xs"
          mr={10}
          variant="outline"
          color="gray"
          onClick={() => {
            setOpenedEdit(true)
            setCurrentEditValue(element)
          }}
        >
          edit
        </Button>
        <Button
          size="xs"
          variant="outline"
          color="red"
          onClick={() => {
            handleDelete(element.id)
          }}
        >
          delete
        </Button>
      </td>
    </tr>
  ))
  function handleSubmit(values) {
    var formData = new FormData()
    formData.append('name', values.name)
    formData.append('quantity', values.quantity)
    formData.append('location', values.location)
    formData.append('price', values.price)
    formData.append('image', image)
    fetch('/items', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res)
        loadItems()
      })
      .catch((e) => {
        alert('something went wrong')
      })
    setOpened(false)
    form.reset()
  }
  function handleDelete(id) {
    fetch('/items/' + id, {
      method: 'DELETE',
    })
      .then((res) => {
        // console.log(res)
        loadItems()
      })
      .catch((e) => {
        alert('something went wrong')
      })
  }
  const changeHandler = (event) => {
    console.log(event.target.files[0].name)
    let extention = event.target.files[0].name.split('.').pop()
    if (extention === 'png' || extention === 'jpg' || extention === 'jpeg') {
      setImage(event.target.files[0])
    } else {
      alert('please select image file')
    }
  }
  return (
    <div className="App">
      <EditItem
        openedEdit={openedEdit}
        value={currentEditValue}
        loadItems={loadItems}
        setOpenedEdit={setOpenedEdit}
      />
      <Modal opened={opened} onClose={() => setOpened(false)} title="Add item">
        {/* Modal content */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <input type="file" name="file" onChange={changeHandler} />
          <TextInput
            required
            label="Name"
            placeholder="Name"
            {...form.getInputProps('name')}
          />
          <NumberInput
            required
            label="quantity"
            placeholder="quantity"
            {...form.getInputProps('quantity')}
          />
          <Select
            label="location"
            placeholder="location"
            data={[
              { value: 'Toronto', label: 'Toronto' },
              { value: 'Ottawa', label: 'Ottawa' },
              { value: 'Vancouver', label: 'Vancouver' },
              { value: 'New York', label: 'New York' },
              { value: 'Seattle', label: 'Seattle' },
            ]}
            {...form.getInputProps('location')}
          />
          <NumberInput
            required
            label="price"
            placeholder="price"
            {...form.getInputProps('price')}
          />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>

      <Group position="right" mb={20}>
        <Button onClick={() => setOpened(true)}>Add New Item</Button>
      </Group>
      <div className="table-container">
        <Table verticalSpacing="md" fontSize="md" highlightOnHover>
          <thead>
            <tr>
              <th>image</th>
              <th>name</th>
              <th>location</th>
              <th>Weather</th>
              <th>quantity</th>
              <th>price</th>
              <th>edit/delete</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  )
}

export default App
