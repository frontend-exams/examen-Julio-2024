// This is a new file for solution!
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import { create } from '../../api/PerformanceEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { Formik } from 'formik'
import TextError from '../../components/TextError'

export default function CreatePerformanceScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState()
  // OJO! Hay que pasarle el restaurantId como initialValue porque será necesario en el create, aunque no lo mostremos en los inputs
  const initialPerformanceValues = { group: null, appointment: null, restaurantId: route.params.id } // Nos fijamos que como es una pantalla "Create" los initialValues no son useState
  const validationSchema = yup.object().shape({
    group: yup
      .string()
      .max(255, 'Group name too long')
      .required('Performance group is required'),
    appointment: yup
      .date()
      .required('Appointment date is required')
  })
  // EN UN CREATE NO NOS HACEN FALTA useEffect A MENOS QUE TENGAMOS UN DROPDOWN

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
      navigation.navigate('RestaurantsScreen', { dirty: true }) // Volvemos al RestaurantScreen cuando lo creamos
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors) // Para mostrarlo luego en el form
    }
  }
  // Nos fijamos que como no es un edit y los initialValues no son useEffect, este Formik no tiene enableReinitialize
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialPerformanceValues}
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
                placeholder= 'mm/dd/yyyy'
              />

              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }

              <Pressable
                onPress={handleSubmit}
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
  }
})
