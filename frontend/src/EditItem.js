import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Group,
  TextInput,
  NumberInput,
  Select,
} from '@mantine/core'
import { useForm } from '@mantine/form'

function EditItem(props) {
  const [image, setImage] = useState(undefined)

  const form = useForm({
    initialValues: {
      name: props.value.name,
      quantity: props.value.quantity,
      location: props.value.location,
      price: props.value.price,
    },

    validate: {
      name: (value) => (value.length < 1 ? 'Required' : null),
    },
  })
  function handleUpdate(values) {
    var formData = new FormData()
    formData.append('name', values.name)
    formData.append('quantity', values.quantity)
    formData.append('location', values.location)
    formData.append('price', values.price)
    formData.append('image', image)
    fetch('/items/' + props.value.id, {
      method: 'PUT',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        props.loadItems()
      })
      .catch((e) => {
        alert('something went wrong')
      })
    props.setOpenedEdit(false)
    form.reset()
  }

  useEffect(() => {
    form.setValues({
      name: props.value.name,
      quantity: Number(props.value.quantity),
      location: props.value.location,
      price: Number(props.value.price),
    })
    console.log(props.value)

    return () => {}
  }, [props.value])
  const imageHandler = (event) => {
    console.log(event.target.files[0].name)
    let extention = event.target.files[0].name.split('.').pop()
    if (extention === 'png' || extention === 'jpg' || extention === 'jpeg') {
      setImage(event.target.files[0])
    } else {
      alert('please select image file')
    }
  }
  return (
    <Modal
      opened={props.openedEdit}
      onClose={() => props.setOpenedEdit(false)}
      title="Add item"
    >
      {/* Modal content */}
      <form onSubmit={form.onSubmit(handleUpdate)}>
        <input type="file" name="file" onChange={imageHandler} />

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
  )
}

export default EditItem
