'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/core/config';
import { HiOutlineArrowLeft, HiOutlineCamera } from 'react-icons/hi';

export function AddPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<Array<{ value: string; id: string }>>([]);
  const [offerTypes, setOfferTypes] = useState<Array<{ name: string; value: string; id: string }>>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string; last_name: string }>>([]);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [searchNationalId, setSearchNationalId] = useState('');
  const [searchedClient, setSearchedClient] = useState<{ id: string; name: string; last_name: string; national_id: string } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string; last_name: string; national_id: string } | null>(null);
  const [showCreateClientForm, setShowCreateClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    last_name: '',
    national_id: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos básicos de la propiedad
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    status: 'available',
    type: '',
    type_offer: '',
    id_owner: '',
    
    // Detalles de la propiedad
    area_sqm: '',
    bedrooms: '',
    bathrooms: '',
    half_bath: '',
    lot_size: '',
    parking_spots: '',
    price: '',
    is_furnished: false,
    period: 'monthly',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Redimensionar si es muy grande (máximo 1920px de ancho)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a blob con compresión (calidad 0.7)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.7
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Comprimir imagen
      const compressedFile = await compressImage(file);
      setImageFile(compressedFile);
      
      // Mostrar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearchClient = async () => {
    setSearchError(null);
    setSearchedClient(null);
    setShowCreateClientForm(false);

    if (!searchNationalId.trim()) {
      setSearchError('Ingresa una cédula');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, last_name, national_id')
        .eq('national_id', searchNationalId.trim())
        .single();

      if (error || !data) {
        setSearchError('Cliente no encontrado');
        setShowCreateClientForm(true);
        setNewClientData(prev => ({ ...prev, national_id: searchNationalId.trim() }));
        return;
      }

      setSearchedClient(data);
    } catch (err) {
      setSearchError('Error al buscar cliente');
      setShowCreateClientForm(true);
      setNewClientData(prev => ({ ...prev, national_id: searchNationalId.trim() }));
    }
  };

  const handleSelectClient = () => {
    if (searchedClient) {
      setFormData(prev => ({ ...prev, id_owner: searchedClient.id }));
      setSelectedClient(searchedClient);
      setShowClientDialog(false);
      setSearchNationalId('');
      setSearchedClient(null);
      setSearchError(null);
      setShowCreateClientForm(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClientData.name.trim() || !newClientData.national_id.trim()) {
      setSearchError('Nombre y cédula son requeridos');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClientData.name.trim(),
          last_name: newClientData.last_name.trim() || null,
          national_id: newClientData.national_id.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setFormData(prev => ({ ...prev, id_owner: data.id }));
        setSelectedClient(data);
        setShowClientDialog(false);
        setSearchNationalId('');
        setSearchedClient(null);
        setSearchError(null);
        setShowCreateClientForm(false);
        setNewClientData({ name: '', last_name: '', national_id: '' });
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error al crear cliente');
    }
  };

  const handleCloseDialog = () => {
    setShowClientDialog(false);
    setSearchNationalId('');
    setSearchedClient(null);
    setSearchError(null);
    setShowCreateClientForm(false);
    setNewClientData({ name: '', last_name: '', national_id: '' });
  };

  // Cargar tipos de propiedades y clientes
  useEffect(() => {
    const loadData = async () => {
      // Cargar tipos de propiedades
      const { data: typesData, error: typesError } = await supabase
        .from('type_properties')
        .select('value, id')
        .order('value');
      
      if (typesError) {
        console.error('Error cargando tipos:', typesError);
      }
      
      if (typesData) {
        console.log('Tipos cargados:', typesData);
        setPropertyTypes(typesData);
      }

      // Cargar tipos de ofertas
      const { data: offersData, error: offersError } = await supabase
        .from('type_offers')
        .select('name, value, id')
        .order('name');
      
      if (offersError) {
        console.error('Error cargando tipos de ofertas:', offersError);
      }
      
      if (offersData) {
        console.log('Tipos de ofertas cargados:', offersData);
        setOfferTypes(offersData);
      }

      // Cargar clientes
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, name, last_name')
        .order('name');
      
      if (clientsData) {
        setClients(clientsData);
      }

      // Si hay un ID, cargar la propiedad para editar
      if (propertyId) {
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select(`
            *,
            details_properties (
              area_sqm,
              bedrooms,
              bathrooms,
              half_bath,
              lot_size,
              parking_spots,
              price,
              is_furnished,
              period
            )
          `)
          .eq('id', propertyId)
          .single();

        if (propertyError) {
          console.error('Error cargando propiedad:', propertyError);
          setError('Error al cargar la propiedad');
          return;
        }

        if (property) {
          const details = property.details_properties;
          setFormData({
            title: property.title || '',
            description: property.description || '',
            address: property.address || '',
            latitude: property.latitude?.toString() || '',
            longitude: property.longitude?.toString() || '',
            status: property.status || 'available',
            type: property.id_type || '',
            type_offer: property.id_type_offer || '',
            id_owner: property.id_owner || '',
            area_sqm: details?.area_sqm?.toString() || '',
            bedrooms: details?.bedrooms?.toString() || '',
            bathrooms: details?.bathrooms?.toString() || '',
            half_bath: details?.half_bath?.toString() || '',
            lot_size: details?.lot_size?.toString() || '',
            parking_spots: details?.parking_spots?.toString() || '',
            price: details?.price?.toString() || '',
            is_furnished: details?.is_furnished || false,
            period: details?.period || 'monthly',
          });

          if (property.image) {
            setImagePreview(property.image);
          }

          // Cargar cliente seleccionado
          if (property.id_owner) {
            const { data: client } = await supabase
              .from('clients')
              .select('id, name, last_name, national_id')
              .eq('id', property.id_owner)
              .single();
            
            if (client) {
              setSelectedClient(client);
            }
          }
        }
      }
    };
    
    loadData();
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Obtener el usuario actual (advisor)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      let imageUrl = imagePreview;

      // Subir imagen si hay una nueva
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `properties/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('properties')
            .upload(filePath, imageFile);

          if (uploadError) {
            console.error('Error subiendo imagen:', uploadError);
            // Continuar sin imagen si falla el upload
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('properties')
              .getPublicUrl(filePath);

            imageUrl = publicUrl;
          }
        } catch (err) {
          console.error('Error en upload de imagen:', err);
          // Continuar sin imagen si falla
        }
      }

      // Validar que el tipo de propiedad existe si se seleccionó
      if (formData.type) {
        const { data: typeExists } = await supabase
          .from('type_properties')
          .select('id')
          .eq('id', formData.type)
          .single();
        
        if (!typeExists) {
          throw new Error('El tipo de propiedad seleccionado no es válido');
        }
      }

      // Preparar datos de la propiedad
      const propertyData: any = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        status: formData.status,
        image: imageUrl,
        id_advisor: user.id,
      };

      // Solo agregar id_type si tiene valor
      if (formData.type) {
        propertyData.id_type = formData.type;
      }

      // Solo agregar id_type_offer si tiene valor
      if (formData.type_offer) {
        propertyData.id_type_offer = formData.type_offer;
      }

      // Solo agregar id_owner si tiene valor
      if (formData.id_owner) {
        propertyData.id_owner = formData.id_owner;
      }

      let property;

      if (propertyId) {
        // Actualizar propiedad existente
        const { data, error: propertyError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId)
          .select()
          .single();

        if (propertyError) throw propertyError;
        property = data;

        // Actualizar o insertar detalles
        const detailsData = {
          area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          half_bath: formData.half_bath ? parseInt(formData.half_bath) : null,
          lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
          parking_spots: formData.parking_spots ? parseInt(formData.parking_spots) : null,
          price: formData.price ? parseFloat(formData.price) : null,
          is_furnished: formData.is_furnished,
          period: formData.period,
        };

        // Verificar si ya existen detalles
        const { data: existingDetails } = await supabase
          .from('details_properties')
          .select('id_property')
          .eq('id_property', propertyId)
          .single();

        if (existingDetails) {
          // Actualizar detalles existentes
          const { error: detailsError } = await supabase
            .from('details_properties')
            .update(detailsData)
            .eq('id_property', propertyId);

          if (detailsError) throw detailsError;
        } else {
          // Insertar nuevos detalles
          const { error: detailsError } = await supabase
            .from('details_properties')
            .insert({
              id_property: propertyId,
              ...detailsData,
            });

          if (detailsError) throw detailsError;
        }
      } else {
        // Insertar nueva propiedad
        const { data, error: propertyError } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (propertyError) throw propertyError;
        property = data;

        // Insertar los detalles de la propiedad
        const { error: detailsError } = await supabase
          .from('details_properties')
          .insert({
            id_property: property.id,
            area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
            bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
            half_bath: formData.half_bath ? parseInt(formData.half_bath) : null,
            lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
            parking_spots: formData.parking_spots ? parseInt(formData.parking_spots) : null,
            price: formData.price ? parseFloat(formData.price) : null,
            is_furnished: formData.is_furnished,
            period: formData.period,
          });

        if (detailsError) throw detailsError;
      }

      // Redirigir a la lista de propiedades
      router.push('/properties');
    } catch (err: any) {
      setError(err.message || 'Error al guardar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <HiOutlineArrowLeft className="text-xl" />
          <span>Volver</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {propertyId ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {propertyId ? 'Actualiza la información de la propiedad' : 'Completa la información de la propiedad'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Información Básica
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagen de la Propiedad */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Imagen de la Propiedad
              </label>
              <div className="flex gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1c2b36] hover:bg-[#1c2b36]/90 text-white rounded-lg font-semibold transition-colors"
                >
                  <HiOutlineCamera className="text-xl" />
                  {imagePreview ? 'Cambiar Imagen' : 'Subir/Tomar Foto'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="Ej: Casa Moderna en Zona Residencial"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none resize-none"
                placeholder="Describe las características principales de la propiedad..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="Ej: Urbanización Los Pinos, Calle 5, Casa 10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Oferta
              </label>
              <select
                name="type_offer"
                value={formData.type_offer}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
              >
                <option value="">Seleccionar tipo de oferta</option>
                {offerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Propiedad
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
              >
                <option value="">Seleccionar tipo</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.value}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Cliente/Propietario
              </label>
              <button
                type="button"
                onClick={() => setShowClientDialog(true)}
                className="w-full px-4 py-2.5 bg-[#1c2b36] hover:bg-[#1c2b36]/90 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">search</span>
                Buscar Cliente
              </button>

              {selectedClient && (
                <div className="mt-3 p-4 bg-white dark:bg-[#1a1a1a] border-2 border-emerald-500 dark:border-emerald-600 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">
                          check_circle
                        </span>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {selectedClient.name} {selectedClient.last_name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
                        Cédula: {selectedClient.national_id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(null);
                        setFormData(prev => ({ ...prev, id_owner: '' }));
                      }}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalles de la Propiedad */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Detalles de la Propiedad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Área (m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="area_sqm"
                value={formData.area_sqm}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="150"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tamaño del Lote (m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="lot_size"
                value={formData.lot_size}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Precio ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="250000"
              />
            </div>

            {/* Solo mostrar período si es alquiler */}
            {offerTypes.find(t => t.id === formData.type_offer)?.value === 'Rent' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Período de Pago
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>
            )}

            {/* Solo mostrar amueblada si es alquiler */}
            {offerTypes.find(t => t.id === formData.type_offer)?.value === 'Rent' && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_furnished"
                  name="is_furnished"
                  checked={formData.is_furnished}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#6b1e2e] bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-700 rounded focus:ring-[#6b1e2e] focus:ring-2"
                />
                <label htmlFor="is_furnished" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Propiedad Amueblada
                </label>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Habitaciones
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Baños Completos
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Medios Baños
              </label>
              <input
                type="number"
                name="half_bath"
                value={formData.half_bath}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Estacionamientos
              </label>
              <input
                type="number"
                name="parking_spots"
                value={formData.parking_spots}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                placeholder="2"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Guardando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">save</span>
                Guardar Propiedad
              </>
            )}
          </button>
        </div>
      </form>

      {/* Dialog de Búsqueda de Cliente */}
      {showClientDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Buscar Cliente
              </h3>
              <button
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Cédula de Identidad
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={searchNationalId}
                    onChange={(e) => setSearchNationalId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (searchedClient) {
                          handleSelectClient();
                        } else {
                          handleSearchClient();
                        }
                      }
                    }}
                    placeholder="Ej: V-12345678"
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                  />
                  <button
                    onClick={handleSearchClient}
                    className="px-4 py-2.5 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined">search</span>
                  </button>
                </div>
              </div>

              {searchError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{searchError}</p>
                </div>
              )}

              {searchedClient && (
                <div 
                  className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSelectClient();
                    }
                  }}
                  tabIndex={0}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {searchedClient.name} {searchedClient.last_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cédula: {searchedClient.national_id}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">
                      check_circle
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Presiona Enter para seleccionar
                  </p>
                </div>
              )}

              {showCreateClientForm && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Crear Nuevo Cliente
                  </p>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Cédula *
                    </label>
                    <input
                      type="text"
                      value={newClientData.national_id}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, national_id: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                      placeholder="V-12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={newClientData.name}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={newClientData.last_name}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, last_name: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateClient();
                        }
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6b1e2e]/50 focus:border-[#6b1e2e] outline-none"
                      placeholder="Pérez"
                    />
                  </div>

                  <button
                    onClick={handleCreateClient}
                    className="w-full px-4 py-2 bg-[#1c2b36] hover:bg-[#1c2b36]/90 text-white rounded-lg font-semibold transition-colors text-sm"
                  >
                    Crear Cliente
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseDialog}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                {searchedClient && (
                  <button
                    onClick={handleSelectClient}
                    className="flex-1 px-4 py-2.5 bg-[#6b1e2e] hover:bg-[#6b1e2e]/90 text-white rounded-lg font-semibold transition-colors"
                  >
                    Seleccionar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
