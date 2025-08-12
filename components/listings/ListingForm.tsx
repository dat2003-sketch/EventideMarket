// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import { Button } from '../common/Button';
// import { useImagePicker } from '../../hooks/useImagePicker';
// import { validateListing, getFieldError } from '../../utils/validation';
// import { CATEGORIES, CONDITIONS } from '../../utils/constants';
// import { globalStyles } from '../../styles/globalStyles';

// interface Props {
//   initialValues?: any;
//   onSubmit: (payload: any) => Promise<any>;
// }

// export default function ListingForm({ initialValues, onSubmit }: Props) {
//   const [title, setTitle] = useState(initialValues?.title ?? '');
//   const [description, setDescription] = useState(initialValues?.description ?? '');
//   const [price, setPrice] = useState(String(initialValues?.price ?? ''));
//   const [category, setCategory] = useState(
//     initialValues?.category ?? CATEGORIES[0]
//   );
//   const [condition, setCondition] = useState(
//     initialValues?.condition ?? CONDITIONS[0].value
//   );
//   const [imageUrl, setImageUrl] = useState<string | undefined>(
//     initialValues?.image_url ?? undefined
//   );
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState([] as { field: string; message: string }[]);
//   const { pickAndUploadImage, uploading } = useImagePicker();

//   const payload = useMemo(
//     () => ({
//       title,
//       description,
//       price: Number(price),
//       category,
//       condition,
//       image_url: imageUrl,
//     }),
//     [title, description, price, category, condition, imageUrl]
//   );

//   const selectImage = async () => {
//     const url = await pickAndUploadImage();
//     if (url) setImageUrl(url);
//   };

//   const submit = async () => {
//     const result = validateListing({
//       title,
//       description,
//       price: Number(price),
//       category,
//       condition,
//     });
//     setErrors(result.errors);
//     if (!result.isValid) return;
//     try {
//       setSubmitting(true);
//       await onSubmit(payload);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <View style={{ gap: 12 }}>
//       <Text style={globalStyles.label}>Title</Text>
//       <TextInput style={globalStyles.input} value={title} onChangeText={setTitle} />
//       {!!getFieldError(errors, 'title') && (
//         <Text style={globalStyles.errorText}>
//           {getFieldError(errors, 'title')}
//         </Text>
//       )}

//       <Text style={globalStyles.label}>Description</Text>
//       <TextInput
//         style={globalStyles.textArea}
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />
//       {!!getFieldError(errors, 'description') && (
//         <Text style={globalStyles.errorText}>
//           {getFieldError(errors, 'description')}
//         </Text>
//       )}

//       <Text style={globalStyles.label}>Price</Text>
//       <TextInput
//         style={globalStyles.input}
//         value={price}
//         onChangeText={setPrice}
//         keyboardType="numeric"
//       />
//       {!!getFieldError(errors, 'price') && (
//         <Text style={globalStyles.errorText}>
//           {getFieldError(errors, 'price')}
//         </Text>
//       )}

//       <Text style={globalStyles.label}>Category</Text>
//       <TextInput style={globalStyles.input} value={category} onChangeText={setCategory} />

//       <Text style={globalStyles.label}>Condition</Text>
//       <TextInput style={globalStyles.input} value={condition} onChangeText={setCondition} />

//       <TouchableOpacity
//         onPress={selectImage}
//         style={[globalStyles.buttonSecondary, { alignSelf: 'flex-start' }]}
//       >
//         {uploading ? (
//           <ActivityIndicator />
//         ) : (
//           <Text style={globalStyles.buttonTextSecondary}>
//             {imageUrl ? 'Change Image' : 'Upload Image'}
//           </Text>
//         )}
//       </TouchableOpacity>

//       {!!imageUrl && (
//         <Image
//           source={{ uri: imageUrl }}
//           style={{ width: '100%', height: 180, borderRadius: 12 }}
//         />
//       )}

//       <Button
//         title={
//           submitting
//             ? 'Submitting...'
//             : initialValues
//             ? 'Save Changes'
//             : 'Create Listing'
//         }
//         onPress={submit}
//         loading={submitting}
//       />
//     </View>
//   );
// }

// components/listings/ListingForm.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Button } from '../common/Button';
import Chip from '../common/Chip';
import { useImagePicker } from '../../hooks/useImagePicker';
import { validateListing, getFieldError } from '../../utils/validation';
import {
  CATEGORIES,
  CONDITIONS,
  type ConditionValue,
} from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';

interface Props {
  initialValues?: any;
  onSubmit: (payload: any) => Promise<any>;
}

export default function ListingForm({ initialValues, onSubmit }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [price, setPrice] = useState(String(initialValues?.price ?? ''));
  const [category, setCategory] = useState(initialValues?.category ?? CATEGORIES[0]);

  const [condition, setCondition] = useState<ConditionValue>(
    (initialValues?.condition as ConditionValue) ?? CONDITIONS[0].value
  );

  const [imageUrl, setImageUrl] = useState<string | undefined>(
    initialValues?.image_url ?? undefined
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(
    [] as { field: string; message: string }[]
  );
  const { pickAndUploadImage, uploading } = useImagePicker();

  const payload = useMemo(
    () => ({
      title,
      description,
      price: Number(price),
      category,
      condition,
      image_url: imageUrl,
    }),
    [title, description, price, category, condition, imageUrl]
  );

  const selectImage = async () => {
    const url = await pickAndUploadImage();
    if (url) setImageUrl(url);
  };

  const submit = async () => {
    const result = validateListing({
      title,
      description,
      price: Number(price),
      category,
      condition,
    });
    setErrors(result.errors);
    if (!result.isValid) return;

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={globalStyles.label}>Title</Text>
      <TextInput style={globalStyles.input} value={title} onChangeText={setTitle} />
      {!!getFieldError(errors, 'title') && (
        <Text style={globalStyles.errorText}>{getFieldError(errors, 'title')}</Text>
      )}

      <Text style={globalStyles.label}>Description</Text>
      <TextInput
        style={globalStyles.textArea}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {!!getFieldError(errors, 'description') && (
        <Text style={globalStyles.errorText}>
          {getFieldError(errors, 'description')}
        </Text>
      )}

      <Text style={globalStyles.label}>Price</Text>
      <TextInput
        style={globalStyles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      {!!getFieldError(errors, 'price') && (
        <Text style={globalStyles.errorText}>{getFieldError(errors, 'price')}</Text>
      )}

      <Text style={globalStyles.label}>Category</Text>
      <TextInput
        style={globalStyles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Text style={globalStyles.label}>Condition</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 2 }}
      >
        {CONDITIONS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            selected={condition === c.value}
            onPress={() => setCondition(c.value as ConditionValue)}
          />
        ))}
      </ScrollView>
      {!!getFieldError(errors, 'condition') && (
        <Text style={globalStyles.errorText}>{getFieldError(errors, 'condition')}</Text>
      )}

      <TouchableOpacity
        onPress={selectImage}
        style={[globalStyles.buttonSecondary, { alignSelf: 'flex-start' }]}
      >
        {uploading ? (
          <ActivityIndicator />
        ) : (
          <Text style={globalStyles.buttonTextSecondary}>
            {imageUrl ? 'Change Image' : 'Upload Image'}
          </Text>
        )}
      </TouchableOpacity>

      {!!imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: 180, borderRadius: 12 }}
        />
      )}

      <Button
        title={submitting ? 'Submitting...' : initialValues ? 'Save Changes' : 'Create Listing'}
        onPress={submit}
        loading={submitting}
      />
    </View>
  );
}
