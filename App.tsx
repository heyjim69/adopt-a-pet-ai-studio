
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Heart, Search, MapPin, Phone, Mail, X, ChevronLeft, ChevronRight, 
  User, Menu, Upload, Check, Shield, Star, Filter, ArrowUpRight, 
  Dog, Cat, Rabbit, Bird, HelpCircle, LogOut, Settings, Bell, 
  Share2, MessageCircle, Calendar, SlidersHorizontal, AlertCircle, Trash2, Plus
} from 'lucide-react';
import { Pet, PetType, PetAge, PetSize, User as UserType, SortOption } from './types';
import { MOCK_PETS } from './data';
import { Button, Input, Textarea, Card, Badge, Label, Modal } from './components/UI';

const App: React.FC = () => {
  // --- State ---
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modals
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPostPetModal, setShowPostPetModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterAge, setFilterAge] = useState<string>('All');
  const [filterSize, setFilterSize] = useState<string>('All');
  const [filterDistance, setFilterDistance] = useState<number>(50); 
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Form States & Validation
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [postPetForm, setPostPetForm] = useState({
    name: '',
    type: PetType.DOG,
    breed: '',
    age: PetAge.YOUNG,
    size: PetSize.MEDIUM,
    description: '',
    location: '',
    isVaccinated: false,
    isNeutered: false,
    images: [] as string[]
  });
  const [postPetErrors, setPostPetErrors] = useState<Record<string, string>>({});

  // Success Toast Auto-close
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // --- Helpers ---
  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    setUser({
      id: 'usr1',
      name: 'Jane Foster',
      email: loginEmail,
      avatar: 'https://i.pravatar.cc/150?u=jane',
      location: 'San Francisco, CA',
      phone: '+1 (555) 000-1234'
    });
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setLoginEmail('');
    setLoginError('');
    triggerSuccess('Successfully logged in!');
  };

  const triggerSuccess = (msg: string) => {
    setShowSuccessToast(msg);
  };

  const ageWeight = (age: PetAge) => {
    switch (age) {
      case PetAge.BABY: return 0;
      case PetAge.YOUNG: return 1;
      case PetAge.ADULT: return 2;
      case PetAge.SENIOR: return 3;
      default: return 4;
    }
  };

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || pet.type === filterType;
      const matchesAge = filterAge === 'All' || pet.age === filterAge;
      const matchesSize = filterSize === 'All' || pet.size === filterSize;
      const matchesDistance = pet.distance <= filterDistance;
      
      return matchesSearch && matchesType && matchesAge && matchesSize && matchesDistance;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'distance': return a.distance - b.distance;
        case 'alphabetical': return a.name.localeCompare(b.name);
        case 'age-young': return ageWeight(a.age) - ageWeight(b.age);
        case 'age-old': return ageWeight(b.age) - ageWeight(a.age);
        case 'newest':
        default: return b.id.localeCompare(a.id);
      }
    });
  }, [pets, searchQuery, filterType, filterAge, filterSize, filterDistance, sortBy]);

  const validatePostPet = () => {
    const errors: Record<string, string> = {};
    if (!postPetForm.name.trim()) errors.name = 'Pet name is required';
    if (!postPetForm.breed.trim()) errors.breed = 'Breed is required';
    if (!postPetForm.location.trim()) errors.location = 'Location is required';
    if (postPetForm.description.length < 20) errors.description = 'Description must be at least 20 characters';
    if (postPetForm.images.length === 0) errors.images = 'At least one image is required';
    setPostPetErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePostPet()) return;

    const newPet: Pet = {
      ...postPetForm,
      id: Math.random().toString(36).substr(2, 9),
      distance: Math.floor(Math.random() * 10) + 1,
      gender: 'Male', // Default for now
      ownerName: user?.name || 'Anonymous',
      ownerAvatar: user?.avatar || 'https://i.pravatar.cc/150',
      postedAt: 'Just now',
    };
    setPets([newPet, ...pets]);
    setShowPostPetModal(false);
    setPostPetForm({ 
      name: '', 
      type: PetType.DOG, 
      breed: '', 
      age: PetAge.YOUNG, 
      size: PetSize.MEDIUM, 
      description: '', 
      location: '',
      isVaccinated: false,
      isNeutered: false,
      images: []
    });
    setPostPetErrors({});
    triggerSuccess('Pet listing posted successfully!');
  };

  const addImage = () => {
    if (imageUrlInput.trim()) {
      setPostPetForm({
        ...postPetForm,
        images: [...postPetForm.images, imageUrlInput.trim()]
      });
      setImageUrlInput('');
      if (postPetErrors.images) {
        const newErrors = { ...postPetErrors };
        delete newErrors.images;
        setPostPetErrors(newErrors);
      }
    }
  };

  const removeImage = (index: number) => {
    setPostPetForm({
      ...postPetForm,
      images: postPetForm.images.filter((_, i) => i !== index)
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim().length < 10) {
      setContactError('Please enter at least 10 characters.');
      return;
    }
    setShowContactModal(false);
    setContactMessage('');
    setContactError('');
    triggerSuccess('Message sent to the owner!');
  };

  const resetFilters = () => {
    setFilterType('All');
    setFilterAge('All');
    setFilterSize('All');
    setFilterDistance(50);
    setSearchQuery('');
    setSortBy('newest');
    triggerSuccess('Filters reset');
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-900">
      {/* --- Success Toast --- */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-white px-6 py-3 rounded-custom shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-5 h-5" />
          <span className="font-semibold">{showSuccessToast}</span>
        </div>
      )}

      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedPet(null)}>
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <Dog className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                Pawsitive
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="text-gray-600 hover:text-primary font-medium" onClick={() => setSelectedPet(null)}>Home</button>
              <button className="text-gray-600 hover:text-primary font-medium">About</button>
              <button className="text-gray-600 hover:text-primary font-medium">Resources</button>
              {isLoggedIn && (
                <Button variant="secondary" size="sm" onClick={() => setShowPostPetModal(true)}>
                  Post a Pet
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border hover:bg-gray-50 transition-colors">
                    <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full border" />
                    <span className="text-sm font-semibold hidden lg:block">{user?.name}</span>
                  </button>
                </div>
              ) : (
                <Button onClick={() => setShowLoginModal(true)}>Log In</Button>
              )}
              <button className="md:hidden p-2 rounded-full hover:bg-gray-100" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu --- */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden animate-in fade-in duration-200" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl p-6 animate-in slide-in-from-right duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold">Menu</h2>
              <X className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => setShowMobileMenu(false)} />
            </div>
            <nav className="flex flex-col gap-4">
              <button className="text-left py-2 font-medium">Home</button>
              <button className="text-left py-2 font-medium">About</button>
              <button className="text-left py-2 font-medium">Resources</button>
              {isLoggedIn && <button className="text-left py-2 font-medium text-secondary" onClick={() => { setShowPostPetModal(true); setShowMobileMenu(false); }}>Post a Pet</button>}
              <hr />
              {isLoggedIn ? (
                <button className="text-left py-2 font-medium text-red-500 flex items-center gap-2" onClick={() => { setIsLoggedIn(false); setShowMobileMenu(false); }}>
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              ) : (
                <Button onClick={() => { setShowLoginModal(true); setShowMobileMenu(false); }} fullWidth>Log In</Button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {selectedPet ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setSelectedPet(null)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Listings
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
                  <img src={selectedPet.images[currentImageIndex]} alt={selectedPet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {selectedPet.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <button onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedPet.images.length - 1)} className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md transition-all">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % selectedPet.images.length)} className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md transition-all">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                  <button onClick={() => toggleFavorite(selectedPet.id)} className="absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-md hover:bg-white transition-all">
                    <Heart className={`w-6 h-6 transition-colors ${favorites.includes(selectedPet.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>
                {selectedPet.images.length > 1 && (
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {selectedPet.images.map((img, idx) => (
                      <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-extrabold text-gray-900">{selectedPet.name}</h2>
                    <p className="text-lg text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-5 h-5 text-gray-400" /> {selectedPet.location} • {selectedPet.distance} miles away
                    </p>
                  </div>
                  <Badge color="bg-primary/10 text-primary px-4 py-1.5 text-sm uppercase tracking-wide">{selectedPet.gender}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500 font-medium">Age</p>
                    <p className="text-lg font-bold">{selectedPet.age}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500 font-medium">Breed</p>
                    <p className="text-lg font-bold truncate px-2">{selectedPet.breed}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500 font-medium">Size</p>
                    <p className="text-lg font-bold">{selectedPet.size}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">About {selectedPet.name}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{selectedPet.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedPet.isVaccinated && <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100"><Shield className="w-4 h-4" /> Vaccinated</div>}
                    {selectedPet.isNeutered && <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100"><Check className="w-4 h-4" /> Neutered</div>}
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img src={selectedPet.ownerAvatar} alt={selectedPet.ownerName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                      <div>
                        <p className="text-sm text-gray-500">Posted by</p>
                        <p className="font-bold">{selectedPet.ownerName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button fullWidth onClick={() => setShowContactModal(true)}><Mail className="w-5 h-5 mr-2" /> Message Owner</Button>
                    <Button fullWidth variant="outline" onClick={() => setShowCallModal(true)}><Phone className="w-5 h-5 mr-2" /> View Phone</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative rounded-3xl overflow-hidden py-16 px-8 text-center bg-gradient-to-br from-primary to-secondary text-white shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-sm">Find your best friend</h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">1,000+ pets are waiting for their forever home.</p>
              <div className="max-w-3xl mx-auto relative">
                <Input placeholder="Search breed or name..." className="pl-12 py-6 text-lg rounded-2xl shadow-xl text-gray-800 border-0 focus:ring-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>

            {/* Filters Bar with Slider */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-20 z-30 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <span>Filters</span>
                  <Badge color="bg-primary/10 text-primary ml-2">{filteredPets.length} matches</Badge>
                </div>
                <button onClick={resetFilters} className="text-sm text-primary hover:underline font-medium">Clear all</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase text-gray-400 text-center block">Distance: <span className="text-primary">{filterDistance} mi</span></Label>
                  <input type="range" min="1" max="50" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2" value={filterDistance} onChange={(e) => setFilterDistance(parseInt(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase text-gray-400">Type</Label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="All">All Species</option>
                    <option value={PetType.DOG}>Dogs</option>
                    <option value={PetType.CAT}>Cats</option>
                    <option value={PetType.RABBIT}>Rabbits</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase text-gray-400">Age</Label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={filterAge} onChange={(e) => setFilterAge(e.target.value)}>
                    <option value="All">Any Age</option>
                    <option value={PetAge.BABY}>Baby</option>
                    <option value={PetAge.YOUNG}>Young</option>
                    <option value={PetAge.ADULT}>Adult</option>
                    <option value={PetAge.SENIOR}>Senior</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase text-gray-400">Size</Label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
                    <option value="All">Any Size</option>
                    <option value={PetSize.SMALL}>Small</option>
                    <option value={PetSize.MEDIUM}>Medium</option>
                    <option value={PetSize.LARGE}>Large</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase text-gray-400">Sort</Label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none font-semibold text-primary" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                    <option value="newest">Newest</option>
                    <option value="distance">Distance</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="age-young">Youngest</option>
                    <option value="age-old">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPets.length > 0 ? (
                filteredPets.map((pet) => (
                  <Card key={pet.id} className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] overflow-hidden" onClick={() => setSelectedPet(pet)}>
                      <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(pet.id); }} className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-md">
                        <Heart className={`w-5 h-5 ${favorites.includes(pet.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      </button>
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <Badge color="bg-white/90 text-gray-800 backdrop-blur-sm">{pet.age}</Badge>
                        <Badge color="bg-secondary/90 text-white backdrop-blur-sm">{pet.distance} mi</Badge>
                      </div>
                    </div>
                    <div className="p-4" onClick={() => setSelectedPet(pet)}>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{pet.name}</h3>
                        <span className="text-xs font-bold text-gray-400">{pet.type}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-1">{pet.breed}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto"><Search className="w-10 h-10 text-gray-400" /></div>
                  <h3 className="text-2xl font-bold">No pets found</h3>
                  <Button variant="outline" onClick={resetFilters}>Clear filters</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- Modals --- */}
      
      <Modal isOpen={showContactModal} onClose={() => { setShowContactModal(false); setContactError(''); }} title={`Message ${selectedPet?.ownerName}`}>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <Label>Your Message</Label>
            <Textarea 
              placeholder={`Write your message...`} 
              value={contactMessage}
              onChange={(e) => { setContactMessage(e.target.value); if(e.target.value.length >= 10) setContactError(''); }}
              error={contactError}
              maxChars={500}
              currentChars={contactMessage.length}
              required
            />
          </div>
          <Button fullWidth type="submit">Send Message</Button>
        </form>
      </Modal>

      <Modal isOpen={showPostPetModal} onClose={() => { setShowPostPetModal(false); setPostPetErrors({}); }} title="List a Pet for Adoption" maxWidth="max-w-3xl">
        <form onSubmit={handlePostPetSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Core Details */}
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input required error={postPetErrors.name} value={postPetForm.name} onChange={e => setPostPetForm({...postPetForm, name: e.target.value})} placeholder="e.g. Luna" />
            </div>
            <div>
              <Label>Breed</Label>
              <Input required error={postPetErrors.breed} value={postPetForm.breed} onChange={e => setPostPetForm({...postPetForm, breed: e.target.value})} placeholder="e.g. Golden Retriever" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-custom outline-none" value={postPetForm.age} onChange={e => setPostPetForm({...postPetForm, age: e.target.value as PetAge})}>
                  {Object.values(PetAge).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Size</Label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-custom outline-none" value={postPetForm.size} onChange={e => setPostPetForm({...postPetForm, size: e.target.value as PetSize})}>
                  {Object.values(PetSize).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input required error={postPetErrors.location} value={postPetForm.location} onChange={e => setPostPetForm({...postPetForm, location: e.target.value})} placeholder="City, State" />
            </div>
            <div className="flex gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-primary cursor-pointer" 
                  checked={postPetForm.isVaccinated}
                  onChange={e => setPostPetForm({...postPetForm, isVaccinated: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Vaccinated</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-primary cursor-pointer" 
                  checked={postPetForm.isNeutered}
                  onChange={e => setPostPetForm({...postPetForm, isNeutered: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Neutered</span>
              </label>
            </div>
          </div>

          {/* Column 2: Photos and Description */}
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Textarea required error={postPetErrors.description} maxChars={500} currentChars={postPetForm.description.length} value={postPetForm.description} onChange={e => setPostPetForm({...postPetForm, description: e.target.value})} placeholder="Tell us about the pet's personality..." />
            </div>

            <div>
              <Label>Pet Photos</Label>
              <div className="flex gap-2 mb-2">
                <Input 
                  placeholder="Paste Image URL..." 
                  value={imageUrlInput} 
                  onChange={e => setImageUrlInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" size="sm" onClick={addImage}><Plus className="w-4 h-4" /></Button>
              </div>
              {postPetErrors.images && <p className="text-xs text-red-500 mb-2">{postPetErrors.images}</p>}
              
              <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                {postPetForm.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                    <img src={img} className="w-full h-full object-cover" alt="Pet preview" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {postPetForm.images.length === 0 && (
                  <div className="col-span-3 border-2 border-dashed border-gray-100 rounded-md py-6 text-center">
                    <p className="text-xs text-gray-400">No images added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4 pt-4 border-t">
            <Button variant="outline" fullWidth type="button" onClick={() => setShowPostPetModal(false)}>Cancel</Button>
            <Button fullWidth type="submit">Publish Listing</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showCallModal} onClose={() => setShowCallModal(false)} title="Contact">
        <div className="text-center space-y-6">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto"><Phone className="w-8 h-8 text-primary" /></div>
          <p className="text-3xl font-bold">+1 (555) 234-5678</p>
          <Button fullWidth onClick={() => setShowCallModal(false)}>Close</Button>
        </div>
      </Modal>

      <Modal isOpen={showLoginModal} onClose={() => { setShowLoginModal(false); setLoginError(''); setLoginEmail(''); }} title="Log In">
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input 
              type="email"
              placeholder="Enter your email" 
              value={loginEmail}
              onChange={(e) => { setLoginEmail(e.target.value); if(loginError) setLoginError(''); }}
              error={loginError}
              required
            />
          </div>
          <Button fullWidth type="submit">Log In</Button>
        </form>
      </Modal>
    </div>
  );
};

export default App;
