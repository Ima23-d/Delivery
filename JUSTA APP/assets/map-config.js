// Configuração de Mapas para Sistema de Corridas JUSTA - Versão Uber
window.MapSystem = {
    // Configurações do Leaflet
    map: null,
    userMarker: null,
    driverMarker: null,
    routePolyline: null,
    destinationMarker: null,
    locationWatchId: null,
    
    // Inicializar mapa
    initMap: function(containerId, center = [-23.5505, -46.6333]) {
        if (this.map) {
            this.map.remove();
        }
        
        this.map = L.map(containerId).setView(center, 15);
        
        // Adicionar tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        return this.map;
    },
    
    // Adicionar marcador do usuário
    addUserMarker: function(lat, lng, title = 'Sua localização') {
        if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
        }
        
        this.userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '📍',
                iconSize: [30, 30]
            })
        }).addTo(this.map);
        
        this.userMarker.bindPopup(title);
        return this.userMarker;
    },
    
    // Adicionar marcador do motorista
    addDriverMarker: function(lat, lng, driverName = 'Motorista') {
        if (this.driverMarker) {
            this.map.removeLayer(this.driverMarker);
        }
        
        this.driverMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'driver-marker',
                html: '🚗',
                iconSize: [30, 30]
            })
        }).addTo(this.map);
        
        this.driverMarker.bindPopup(driverName);
        return this.driverMarker;
    },
    
    // Adicionar marcador de destino
    addDestinationMarker: function(lat, lng, title = 'Destino') {
        if (this.destinationMarker) {
            this.map.removeLayer(this.destinationMarker);
        }
        
        this.destinationMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'destination-marker',
                html: '🎯',
                iconSize: [30, 30]
            })
        }).addTo(this.map);
        
        this.destinationMarker.bindPopup(title);
        return this.destinationMarker;
    },
    
    // Calcular rota completa (motorista -> passageiro -> destino)
    calculateCompleteRoute: async function(driverLocation, passengerLocation, destinationLocation) {
        try {
            // Remover rota anterior
            if (this.routePolyline) {
                this.map.removeLayer(this.routePolyline);
            }
            
            // Calcular rota do motorista até o passageiro
            const routeToPassenger = await this.calculateRoute(driverLocation, passengerLocation);
            
            // Calcular rota do passageiro até o destino
            const routeToDestination = await this.calculateRoute(passengerLocation, destinationLocation);
            
            if (routeToPassenger && routeToDestination) {
                // Combinar as duas rotas
                const combinedGeometry = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: routeToPassenger.geometry
                        },
                        {
                            type: "Feature",
                            properties: {},
                            geometry: routeToDestination.geometry
                        }
                    ]
                };
                
                // Adicionar rota combinada ao mapa
                this.routePolyline = L.geoJSON(combinedGeometry, {
                    style: {
                        color: '#2196F3',
                        weight: 4,
                        opacity: 0.7
                    }
                }).addTo(this.map);
                
                // Ajustar view para mostrar toda a rota
                this.map.fitBounds(this.routePolyline.getBounds());
                
                return {
                    toPassenger: routeToPassenger,
                    toDestination: routeToDestination,
                    totalDistance: routeToPassenger.distance + routeToDestination.distance,
                    totalDuration: routeToPassenger.duration + routeToDestination.duration
                };
            }
        } catch (error) {
            console.error('Erro ao calcular rota completa:', error);
            return null;
        }
    },
    
    // Calcular rota entre dois pontos
    calculateRoute: async function(origin, destination) {
        try {
            // Usar OSRM para calcular rota
            const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                
                return {
                    distance: route.distance / 1000, // km
                    duration: route.duration / 60, // minutos
                    geometry: route.geometry
                };
            }
        } catch (error) {
            console.error('Erro ao calcular rota:', error);
            return null;
        }
    },
    
    // Atualizar posição do motorista em tempo real
    updateDriverPosition: function(lat, lng) {
        if (this.driverMarker) {
            this.driverMarker.setLatLng([lat, lng]);
        }
    },
    
    // Atualizar posição do usuário em tempo real
    updateUserPosition: function(lat, lng) {
        if (this.userMarker) {
            this.userMarker.setLatLng([lat, lng]);
        }
    },
    
    // Iniciar tracking em tempo real do motorista
    startDriverTracking: function(driverId, callback) {
        // Listener para mudanças na posição do motorista
        return db.collection('users').doc(driverId).onSnapshot((doc) => {
            if (doc.exists) {
                const driverData = doc.data();
                if (driverData.currentLocation) {
                    const lat = driverData.currentLocation.latitude;
                    const lng = driverData.currentLocation.longitude;
                    
                    this.updateDriverPosition(lat, lng);
                    
                    if (callback) {
                        callback({ lat, lng });
                    }
                }
            }
        });
    },
    
    // Parar tracking
    stopTracking: function(listener) {
        if (listener) {
            listener();
        }
    },
    
    // Calcular distância entre dois pontos
    calculateDistance: function(lat1, lng1, lat2, lng2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },
    
    // Verificar se motorista está próximo do usuário
    isDriverNearby: function(userLat, userLng, driverLat, driverLng, maxDistance = 5) {
        const distance = this.calculateDistance(userLat, userLng, driverLat, driverLng);
        return distance <= maxDistance;
    },
    
    // Limpar mapa
    clearMap: function() {
        if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
            this.userMarker = null;
        }
        if (this.driverMarker) {
            this.map.removeLayer(this.driverMarker);
            this.driverMarker = null;
        }
        if (this.destinationMarker) {
            this.map.removeLayer(this.destinationMarker);
            this.destinationMarker = null;
        }
        if (this.routePolyline) {
            this.map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }
    }
};

// Sistema de Geolocalização Avançado
window.GeoLocationSystem = {
    // Obter localização atual com fallback e timeouts maiores
    getCurrentLocation: function() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalização não suportada'));
                return;
            }

            const tryGet = (options, onFail) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const coords = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp
                        };
                        try { localStorage.setItem('lastKnownLocation', JSON.stringify(coords)); } catch (e) {}
                        resolve(coords);
                    },
                    async (error) => {
                        if (typeof onFail === 'function') {
                            onFail(error);
                        } else {
                            // Fallback: usar última localização conhecida se existir
                            try {
                                const cached = localStorage.getItem('lastKnownLocation');
                                if (cached) {
                                    return resolve(JSON.parse(cached));
                                }
                            } catch (e) {}
                            reject(error);
                        }
                    },
                    options
                );
            };

            // Primeira tentativa: alta precisão
            tryGet({ enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }, (err) => {
                // Se estourar timeout, tentar com menor precisão e timeout um pouco maior
                if (err && err.code === 3) {
                    tryGet({ enableHighAccuracy: false, timeout: 25000, maximumAge: 120000 });
                } else {
                    // Outras falhas: tentar novamente com menor precisão
                    tryGet({ enableHighAccuracy: false, timeout: 25000, maximumAge: 120000 });
                }
            });
        });
    },
    
    // Monitorar localização em tempo real com reconfiguração em caso de timeout
    watchLocation: function(callback, errorCallback) {
        if (!navigator.geolocation) {
            console.error('Geolocalização não suportada');
            return null;
        }

        const startWatch = (options) => navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                try { localStorage.setItem('lastKnownLocation', JSON.stringify(coords)); } catch (e) {}
                callback(coords);
            },
            (error) => {
                console.error('Erro na geolocalização:', error);
                if (error.code === 3) { // timeout
                    // Reiniciar com menor precisão e timeout maior
                    return startWatch({ enableHighAccuracy: false, timeout: 25000, maximumAge: 120000 });
                }
                if (errorCallback) errorCallback(error);
            },
            options
        );

        return startWatch({ enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 });
    },
    
    // Parar monitoramento
    stopWatching: function(watchId) {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
    },
    
    // Geocodificar endereço para coordenadas
    geocodeAddress: async function(address) {
        try {
            // Usar Nominatim (OpenStreetMap) para geocodificação
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
            );
            const data = await response.json();
            
            if (data && data[0]) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    display_name: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error('Erro na geocodificação:', error);
            return null;
        }
    },
    
    // Reverse geocodificar coordenadas para endereço
    reverseGeocode: async function(lat, lng) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
                return {
                    address: data.display_name,
                    road: data.address?.road || '',
                    suburb: data.address?.suburb || '',
                    city: data.address?.city || data.address?.town || '',
                    state: data.address?.state || '',
                    country: data.address?.country || ''
                };
            }
            return null;
        } catch (error) {
            console.error('Erro no reverse geocoding:', error);
            return null;
        }
    }
};

// Sistema de Matching de Corridas Avançado
window.RideMatchingSystem = {
    // Verificar motoristas próximos com filtros avançados
    findNearbyDrivers: async function(userLat, userLng, maxDistance = 5) {
        try {
            console.log('🔍 RideMatching: Iniciando busca por motoristas...');
            console.log('🔍 RideMatching: Localização do usuário:', { lat: userLat, lng: userLng });
            console.log('🔍 RideMatching: Raio máximo:', maxDistance, 'km');
            
            const driversSnapshot = await db.collection('users')
                .where('userType', '==', 'motorista')
                .where('status', '==', 'approved')
                .where('isOnline', '==', true)
                .get();
            
            console.log('🔍 RideMatching: Total de motoristas aprovados e online:', driversSnapshot.size);
            
            const nearbyDrivers = [];
            
            driversSnapshot.forEach(doc => {
                const driverData = doc.data();
                console.log('🔍 RideMatching: Verificando motorista:', driverData.nome || driverData.name || 'Sem nome');
                console.log('🔍 RideMatching: Localização do motorista:', driverData.currentLocation);
                
                if (driverData.currentLocation) {
                    const distance = MapSystem.calculateDistance(
                        userLat, userLng,
                        driverData.currentLocation.latitude,
                        driverData.currentLocation.longitude
                    );
                    
                    console.log('🔍 RideMatching: Distância calculada:', distance.toFixed(2), 'km');
                    
                    if (distance <= maxDistance) {
                        nearbyDrivers.push({
                            id: doc.id,
                            ...driverData,
                            distance: distance
                        });
                        console.log('✅ RideMatching: Motorista incluído:', driverData.nome || driverData.name);
                    } else {
                        console.log('❌ RideMatching: Motorista muito longe:', driverData.nome || driverData.name, '(', distance.toFixed(2), 'km )');
                    }
                } else {
                    console.log('❌ RideMatching: Motorista sem localização:', driverData.nome || driverData.name);
                }
            });
            
            console.log('🔍 RideMatching: Total de motoristas próximos encontrados:', nearbyDrivers.length);
            
            // Ordenar por distância e avaliação
            const sortedDrivers = nearbyDrivers.sort((a, b) => {
                // Priorizar por distância, depois por avaliação
                if (Math.abs(a.distance - b.distance) < 0.5) {
                    return (b.rating || 0) - (a.rating || 0);
                }
                return a.distance - b.distance;
            });
            
            console.log('🔍 RideMatching: Motoristas ordenados por proximidade e avaliação');
            
            return sortedDrivers;
        } catch (error) {
            console.error('❌ RideMatching: Erro ao buscar motoristas próximos:', error);
            return [];
        }
    },
    
    // Notificar motoristas sobre nova corrida
    notifyDrivers: async function(rideData, nearbyDrivers) {
        try {
            const notifications = nearbyDrivers.map(driver => ({
                driverId: driver.id,
                rideId: rideData.id,
                type: 'new_ride',
                data: rideData,
                createdAt: new Date(),
                read: false,
                priority: driver.distance <= 2 ? 'high' : 'normal' // Prioridade alta para motoristas muito próximos
            }));
            
            // Salvar notificações no Firestore
            const batch = db.batch();
            notifications.forEach(notification => {
                const notificationRef = db.collection('notifications').doc();
                batch.set(notificationRef, notification);
            });
            
            await batch.commit();
            
            return notifications.length;
        } catch (error) {
            console.error('Erro ao notificar motoristas:', error);
            return 0;
        }
    },
    
    // Calcular preço estimado da corrida
    calculateEstimatedPrice: function(distance, duration, basePrice = 5, pricePerKm = 2.5, pricePerMinute = 0.5) {
        const distancePrice = distance * pricePerKm;
        const timePrice = duration * pricePerMinute;
        return basePrice + distancePrice + timePrice;
    }
};

// Sistema de Tracking de Corrida
window.RideTrackingSystem = {
    currentRide: null,
    driverTracking: null,
    
    // Iniciar tracking de uma corrida
    startRideTracking: function(rideId, callback) {
        this.currentRide = rideId;
        
        // Listener para mudanças na corrida
        return db.collection('rides').doc(rideId).onSnapshot((doc) => {
            if (doc.exists) {
                const rideData = doc.data();
                if (callback) {
                    callback(rideData);
                }
                
                // Se o motorista foi aceito, iniciar tracking do motorista
                if (rideData.status === 'accepted' && rideData.driverId && !this.driverTracking) {
                    this.startDriverTracking(rideData.driverId);
                }
            }
        });
    },
    
    // Iniciar tracking do motorista
    startDriverTracking: function(driverId) {
        this.driverTracking = MapSystem.startDriverTracking(driverId, (position) => {
            // Atualizar posição do motorista em tempo real
            console.log('Motorista atualizou posição:', position);
        });
    },
    
    // Parar tracking
    stopTracking: function() {
        if (this.driverTracking) {
            MapSystem.stopTracking(this.driverTracking);
            this.driverTracking = null;
        }
        this.currentRide = null;
    }
};

