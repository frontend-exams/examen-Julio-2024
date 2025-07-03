// This is a new file for solution!
// Literalmente he copiado todo del CreateProduct, toda la lógica del formulario

import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { create } from '../../api/PerformanceEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as yup from 'yup'
import { Formik } from 'formik'
import TextError from '../../components/TextError'

export default function CreatePerformanceScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState()

  const initialProductValues = { group: null, appointment: null, restaurantId: route.params.id } // OJO!!! Hay que poner por defecto el id del restaurante asociado a la performance si no peta ya que intenta crear una performance sin restaurantId y da error en el backend
  const validationSchema = yup.object().shape({
    group: yup
      .string()
      .max(255, 'Group name too long')
      .required('Group name is required'),
    appointment: yup
      .date()
      .required('Appointment is required')
  })
  // No hace falta hacer ningún useEffect aquí--- los useEffect se suelen hacer cuando hay DropDownPickers
  const createPerformance = async (values) => {
    setBackendErrors([])
    try {
      const createdPerformance = await create(values)
      showMessage({
        message: `Performance ${createdPerformance.group} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('RestaurantsScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialProductValues}
      onSubmit={createPerformance}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='group'
                label='Group:'
              />
              <InputItem
                name='appointment'
                label='Appointment:'
                placeholder = 'mm/dd/yy'
              />
            {/* Siempre habrá una parte en el formulario donde mostraremos los backendErros que se producen cuando se crea/actualiza el objeto sobre el que estamos haciendo el formulario */}
              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }

              <Pressable
                onPress={ handleSubmit } // Cuando se pulsa sobre el botón Save se hará el handleSubmit que llevará todos los valores como parámetros a la función definida en el prop onSubmit
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5

  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  switch: {
    marginTop: 5
  }
})
