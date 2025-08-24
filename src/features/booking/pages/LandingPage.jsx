import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Shield, 
  Users, 
  Phone,
  Mail,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const services = [
    {
      name: 'Limpieza Dental',
      description: 'Limpieza profunda y pulido dental',
      price: 'S/ 80',
      duration: '60 min',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Blanqueamiento',
      description: 'Tratamiento profesional de blanqueamiento',
      price: 'S/ 250',
      duration: '90 min',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Ortodoncia',
      description: 'Evaluación y tratamiento de ortodoncia',
      price: 'S/ 120',
      duration: '45 min',
      image: 'https://images.pexels.com/photos/6812589/pexels-photo-6812589.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      rating: 5,
      comment: 'Excelente atención y muy fácil reservar online. El proceso fue muy rápido.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Carlos Pérez',
      rating: 5,
      comment: 'Los dentistas son muy profesionales y las instalaciones están impecables.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Ana Rodríguez',
      rating: 5,
      comment: 'Mi hijo se sintió muy cómodo durante su consulta. Altamente recomendado.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Reserva Online',
      description: 'Programa tu cita las 24 horas del día, los 7 días de la semana'
    },
    {
      icon: Clock,
      title: 'Horarios Flexibles',
      description: 'Amplia disponibilidad de horarios para tu comodidad'
    },
    {
      icon: MapPin,
      title: 'Múltiples Ubicaciones',
      description: 'Consultorios en los principales distritos de Lima'
    },
    {
      icon: Shield,
      title: 'Protocolos de Seguridad',
      description: 'Cumplimos con todos los protocolos de bioseguridad'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Dientecitas</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#servicios" className="text-gray-600 hover:text-blue-600 transition-colors">
                Servicios
              </a>
              <a href="#ubicaciones" className="text-gray-600 hover:text-blue-600 transition-colors">
                Ubicaciones
              </a>
              <a href="#testimonios" className="text-gray-600 hover:text-blue-600 transition-colors">
                Testimonios
              </a>
              <a href="#contacto" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contacto
              </a>
            </nav>
            
            <Link
              to="/reservar/cita"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reservar Cita
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Tu sonrisa es nuestra
                <span className="text-blue-600"> prioridad</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Reserva tu cita dental online de forma rápida y sencilla. 
                Profesionales especializados y tecnología de vanguardia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/reservar/cita"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-medium"
                >
                  Reservar Cita Ahora
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                
                <a
                  href="#servicios"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center text-lg font-medium"
                >
                  Ver Servicios
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600">Pacientes Satisfechos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-gray-600">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <div className="text-gray-600">Ubicaciones</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Consulta dental"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Reserva Confirmada</div>
                    <div className="text-sm text-gray-600">En menos de 2 minutos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Dientecitas?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una experiencia dental moderna, cómoda y profesional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600">
              Tratamientos dentales completos con la mejor tecnología
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {service.price}
                      </span>
                      <span className="text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/reservar/cita"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center text-lg font-medium"
            >
              Reservar Servicio
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros pacientes
            </h2>
            <p className="text-xl text-gray-600">
              Testimonios reales de personas que confían en nosotros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              ¿Listo para tu próxima cita?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Reserva ahora y cuida tu sonrisa con los mejores profesionales
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/reservar/cita"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-lg font-medium"
              >
                Reservar Cita Online
                <Calendar className="w-5 h-5 ml-2" />
              </Link>
              
              <a
                href="tel:+51999999999"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center text-lg font-medium"
              >
                Llamar Ahora
                <Phone className="w-5 h-5 ml-2" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Phone className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-semibold">Teléfono</div>
                <div className="opacity-80">+51 999 999 999</div>
              </div>
              <div>
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-semibold">Email</div>
                <div className="opacity-80">info@dientecitas.com</div>
              </div>
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-semibold">Ubicaciones</div>
                <div className="opacity-80">Centro, San Isidro, Miraflores</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Dientecitas</span>
              </div>
              <p className="text-gray-400">
                Tu sonrisa es nuestra prioridad. Cuidamos de tu salud dental con profesionalismo y calidez.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Limpieza Dental</li>
                <li>Blanqueamiento</li>
                <li>Ortodoncia</li>
                <li>Endodoncia</li>
                <li>Cirugía Oral</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ubicaciones</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Lima</li>
                <li>San Isidro</li>
                <li>Miraflores</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+51 999 999 999</li>
                <li>info@dientecitas.com</li>
                <li>Lun-Vie: 8:00-18:00</li>
                <li>Sáb: 8:00-14:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dientecitas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;