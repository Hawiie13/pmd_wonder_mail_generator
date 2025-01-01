import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Clipboard,
} from 'react-native';
import {useForm, useWatch, Controller, UseFormReturn} from 'react-hook-form';
import {
  Box,
  Text,
  Button,
  VStack,
  FormControl,
  WarningOutlineIcon,
  NativeBaseProvider,
  extendTheme,
  HStack,
  Checkbox,
} from 'native-base';
import {Picker} from '@react-native-picker/picker';

import {
  genwonder,
  getPokedexEntry,
  plainArrayToOptions,
  showareas,
  showdungeon,
  showfind2,
  showfloors,
  showftext,
  showpkmn,
  showrewards,
  updateftext,
} from './src/helpers/dungeon.helper';

import type {FormData} from './src/helpers/dungeon.helper';

// Define the config
const config = {
  useSystemColorMode: true,
  initialColorMode: 'light',
};

// extend the theme
export const theme = extendTheme({config});

interface IOption {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  name: keyof FormData;
  label: string;
  options: IOption[];
  rules?: any;
  showMoneyCheckbox?: boolean;
  form: UseFormReturn<FormData>;
}

const defaultValues = {
  missionType: 0,
  client: 0,
  otherPokemon: 0,
  dungeon: 0,
  floor: 1,
  itemToFind: 0,
  itemReward: 0,
  itemRewardMoney: false,
  friendAreaReward: -1,
  messageTitle: '',
  messageBody: '',
};

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  rules,
  showMoneyCheckbox = false,
  form,
}) => {
  const {
    control,
    formState: {errors},
  } = form;
  const colorScheme = useColorScheme();

  const errorField = (color: string) => (errors[name] ? 'red' : color);

  const pickerStyle = {
    color: colorScheme === 'dark' ? 'white' : '#333',
  };

  const boxStyles = {
    borderWidth: 1,
    borderRadius: 5,
    bg: colorScheme === 'dark' ? 'gray.800' : 'white',
    borderColor: errorField(colorScheme === 'dark' ? 'gray.600' : '#ddd'),
  };

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormControl.Label>
        <Text color={colorScheme === 'dark' ? 'white' : 'black'}>{label}</Text>
      </FormControl.Label>
      <HStack alignItems="center">
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({field: {onChange, value}}) => (
            <Box style={boxStyles} flex={1}>
              <Picker
                dropdownIconColor={colorScheme === 'dark' ? 'white' : 'black'}
                selectedValue={value}
                onValueChange={value =>
                  onChange(isNaN(Number(value)) ? value : Number(value))
                }
                style={pickerStyle}
                itemStyle={pickerStyle}>
                {options.map((option, key) => (
                  <Picker.Item
                    key={key}
                    label={option.label}
                    value={option.value}
                    color={colorScheme === 'dark' ? 'white' : 'black'}
                  />
                ))}
              </Picker>
            </Box>
          )}
        />
        {showMoneyCheckbox && (
          <Controller
            control={control}
            name="itemRewardMoney"
            render={({field: {onChange, value}}) => (
              <HStack ml={2} alignItems="center">
                <Checkbox
                  value="+ Money"
                  isChecked={value}
                  onChange={onChange}
                  accessibilityLabel="+ Money"
                />
                <Text ml={1} color={colorScheme === 'dark' ? 'white' : 'black'}>
                  + Money
                </Text>
              </HStack>
            )}
          />
        )}
      </HStack>
      {errors[name] && (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          <Text color={colorScheme === 'dark' ? 'white' : 'black'}>
            {errors[name]?.message || `${label} is required`}
          </Text>
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

const FormPokemonDropDown: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  rules,
  form,
}) => {
  const pickerRef = useRef();
  const {
    control,
    formState: {errors},
    watch,
  } = form;
  const colorScheme = useColorScheme();
  const values = watch();

  const errorField = (color: string) => (errors[name] ? 'red' : color);

  const pickerStyle = {
    color: colorScheme === 'dark' ? 'white' : '#333',
  };

  const boxStyles = {
    borderWidth: 1,
    borderRadius: 5,
    bg: colorScheme === 'dark' ? 'gray.800' : 'white',
    borderColor: errorField(colorScheme === 'dark' ? 'gray.600' : '#ddd'),
  };

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormControl.Label>
        <Text color={colorScheme === 'dark' ? 'white' : 'black'}>{label}</Text>
      </FormControl.Label>
      <HStack alignItems="center">
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({field: {onChange, value}}) => {
            const getEntry = getPokedexEntry(options, value);
            return (
              <HStack alignItems="center">
                {getEntry?.id && (
                  <Box style={styles.container}>
                    <Image
                      source={{
                        uri: `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${getEntry?.id
                          .toString()
                          .padStart(4, '0')}/Normal.png`,
                      }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </Box>
                )}
                <Box style={boxStyles} flex={1}>
                  <Picker
                    dropdownIconColor={
                      colorScheme === 'dark' ? 'white' : 'black'
                    }
                    selectedValue={value}
                    onValueChange={value => {
                      onChange(Number(value));
                    }}
                    style={pickerStyle}
                    itemStyle={pickerStyle}>
                    {options.map((option, key) => (
                      <Picker.Item
                        key={key}
                        label={option.label}
                        value={option.value}
                        color={colorScheme === 'dark' ? 'white' : 'black'}
                      />
                    ))}
                  </Picker>
                </Box>
              </HStack>
            );
          }}
        />
      </HStack>
      {errors[name] && (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          <Text color={colorScheme === 'dark' ? 'white' : 'black'}>
            {errors[name]?.message || `${label} is required`}
          </Text>
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

const App: React.FC = () => {
  const form = useForm<FormData>({
    defaultValues,
  });

  const {handleSubmit, control, reset} = form;

  const values = useWatch<FormData>({control}) as FormData;

  const colorScheme = useColorScheme();

  const onSubmit = (data: FormData) => {
    console.log(data);
    const msg = genwonder(data);
    Alert.alert(
      msg.title,
      msg.message,
      [
        {text: 'copy', onPress: () => Clipboard.setString(msg.message)},
        {text: 'close'},
      ],
      {cancelable: true},
    );
  };

  const missionTypes = [
    'Help Me',
    'Find someone',
    'Escort',
    'Find item',
    'Deliver item',
  ];

  return (
    <NativeBaseProvider>
      <Box flex={1} bg={colorScheme === 'dark' ? 'gray.900' : '#f0f2f5'} p={4}>
        <ScrollView>
          <VStack space={4}>
            <Text
              fontWeight="500"
              color={colorScheme === 'dark' ? 'white' : '#333'}>
              Mission Details:
            </Text>
            <FormSelect
              name="missionType"
              label="Mission Type"
              options={plainArrayToOptions(missionTypes)}
              rules={{required: 'Mission Type is required'}}
              form={form}
            />
            <FormPokemonDropDown
              name="client"
              label="Client"
              options={showpkmn()}
              rules={{required: 'Client is required'}}
              form={form}
            />
            <FormPokemonDropDown
              name="otherPokemon"
              label="Other Pokemon"
              options={showpkmn()}
              rules={{required: 'Other Pokemon is required'}}
              form={form}
            />
            <FormSelect
              name="dungeon"
              label="Dungeon"
              options={showdungeon()}
              rules={{required: 'Dungeon is required'}}
              form={form}
            />
            <FormSelect
              name="floor"
              label="Floor"
              options={showfloors(values)}
              rules={{required: 'Floor is required'}}
              form={form}
            />
            {values.missionType > 2 && (
              <FormSelect
                name="itemToFind"
                label="Item to Find/Deliver"
                options={showfind2(values)}
                rules={{required: 'Item to Find is required'}}
                form={form}
              />
            )}
            <FormSelect
              name="itemReward"
              label="Item Reward"
              options={showrewards()}
              showMoneyCheckbox={true}
              rules={{required: 'Item Reward is required'}}
              form={form}
            />
            <FormSelect
              name="friendAreaReward"
              label="Friend Area Reward"
              options={showareas()}
              rules={{required: 'Friend Area Reward is required'}}
              form={form}
            />
            <FormSelect
              name="messageTitle"
              label="Message Title"
              options={showftext(values, 0)}
              rules={{required: 'Message Title is required'}}
              form={form}
            />

            <FormSelect
              name="messageBody"
              label="Message Body"
              options={updateftext(values)}
              rules={{required: 'Message Body is required'}}
              form={form}
            />

            <Button
              mt={4}
              bg={colorScheme === 'dark' ? '#0a84ff' : '#007bff'}
              onPress={handleSubmit(onSubmit)}>
              <Text color="white">Generate Wonder Mail</Text>
            </Button>

            <Button
              mt={4}
              bg={colorScheme === 'dark' ? '#0a84ff' : '#007bff'}
              onPress={() => reset()}>
              <Text color="white">Clear</Text>
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    marginBottom: 1,
  },
  containerPressed: {
    backgroundColor: '#f0f0f0', // Light gray background on press
  },
  image: {
    width: 32,
    height: 32,
    // marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});

export default App;
