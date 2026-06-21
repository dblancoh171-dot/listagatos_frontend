import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Plus, Send, Trash2 } from 'lucide-react';

function App() {
  const [gatos, setGatos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  // Estado para manejar múltiples cualidades de forma dinámica
  const [cualidades, setCualidades] = useState([{ clave: '', valor: '' }]);
  const [loading, setLoading] = useState(true);

  // ⚠️ COLOCA AQUÍ TU URL REAL DE RENDER (Terminada en /api/gatos)
  const API_URL = 'https://listagatos-backend.onrender.com/api/gatos';

  // 1. Obtener todos los gatos desde el Backend
  const obtenerGatos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setGatos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error obteniendo los gatos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerGatos();
  }, []);

  // 2. Manejar los cambios en los inputs dinámicos de cualidades
  const manejarCambioCualidad = (index, campo, valor) => {
    const nuevasCualidades = [...cualidades];
    nuevasCualidades[index][campo] = valor;
    setCualidades(nuevasCualidades);
  };

  const agregarCampoCualidad = () => {
    setCualidades([...cualidades, { clave: '', valor: '' }]);
  };

  const eliminarCampoCualidad = (index) => {
    const nuevasCualidades = cualidades.filter((_, i) => i !== index);
    setCualidades(nuevasCualidades);
  };

  // 3. Enviar el nuevo gato con su JSONB dinámico a la base de datos
  const guardarGato = async (e) => {
    e.preventDefault();
    if (!nombre || !edad) return alert("Por favor llena los campos principales");

    // Convertimos el array de cualidades [{clave, valor}] en un Objeto JSON real {clave: valor}
    const detallesJSON = {};
    cualidades.forEach(c => {
      if (c.clave.trim() && c.valor.trim()) {
        // Guardamos las llaves en minúsculas y limpias de espacios para mantener orden en la BD
        detallesJSON[c.clave.toLowerCase().trim()] = c.valor.trim();
      }
    });

    const nuevoGato = {
      nombre,
      edad: parseInt(edad),
      detalles: detallesJSON
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoGato)
      });

      if (res.ok) {
        // Limpiamos todo el formulario al tener éxito
        setNombre('');
        setEdad('');
        setCualidades([{ clave: '', valor: '' }]);
        obtenerGatos(); // Recargar el muro dinámicamente
      }
    } catch (error) {
      console.error("Error al guardar gato:", error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff5f5', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* Cabecera Romántica */}
      <header style={{ textAlign: 'center', margin: '40px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffe3e3', padding: '10px 20px', borderRadius: '50px', color: '#e53e3e', fontWeight: 'bold' }}>
          <Heart size={20} fill="#e53e3e" />
          <span>Nuestro Espacio Secreto</span>
          <Heart size={20} fill="#e53e3e" />
        </div>
        <h1 style={{ color: '#2d3748', marginTop: '15px', fontSize: '2.5rem' }}>🐾 El Club de los Michis 🐾</h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>Un lugar dinámico conectado a nuestra base de datos para conocernos más.</p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Formulario Avanzado de Cualidades Múltiples */}
        <section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#4a5568', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', marginTop: 0 }}>
            <Plus size={24} style={{ color: '#e53e3e' }} /> Registrar un Michi Especial
          </h2>
          
          <form onSubmit={guardarGato} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Fila de campos base */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ flex: '2 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} placeholder="Nombre del gato" required />
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold', fontSize: '0.9rem' }}>Edad:</label>
                <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} placeholder="Años" required />
              </div>
            </div>

            {/* Bloque Dinámico Clave-Valor */}
            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', color: '#4a5568', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Cualidades Flexibles (Campos dinámicos guardados en JSONB):
              </label>
              
              {cualidades.map((cualidad, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={cualidad.clave} 
                    onChange={(e) => manejarCambioCualidad(index, 'clave', e.target.value)} 
                    placeholder="¿Qué rasgo es? (Ej: Raza, Hobby, Comida)" 
                    style={{ flex: '1', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                  />
                  <input 
                    type="text" 
                    value={cualidad.valor} 
                    onChange={(e) => manejarCambioCualidad(index, 'valor', e.target.value)} 
                    placeholder="Detalle (Ej: Angora, Dormir, Atún)" 
                    style={{ flex: '1', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
                  />
                  {cualidades.length > 1 && (
                    <button type="button" onClick={() => eliminarCampoCualidad(index)} style={{ backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '11px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={agregarCampoCualidad} style={{ backgroundColor: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '5px' }}>
                + Agregar otra cualidad extra
              </button>
            </div>

            {/* Botón enviar */}
            <button type="submit" style={{ backgroundColor: '#e53e3e', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem', transition: 'background 0.2s' }}>
              <Send size={18} /> Guardar Registro en la Nube
            </button>
          </form>
        </section>

        {/* Muro en tiempo real */}
        <section style={{ marginTop: '10px' }}>
          <h2 style={{ color: '#4a5568', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles style={{ color: '#ecc94b' }} /> Muro de registros en Aiven
          </h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Conectando con el servidor en la nube...</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {gatos.map((gato) => (
                <div key={gato.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid #e53e3e', position: 'relative', flex: '1 1 calc(33.333% - 20px)', minWidth: '260px', boxSizing: 'border-box' }}>
                  
                  {/* Botón flotante para Eliminar */}
                  <button 
                    onClick={async () => {
                      if (window.confirm(`¿Seguro que quieres borrar a ${gato.nombre}?`)) {
                        try {
                          const res = await fetch(`${API_URL}/${gato.id}`, { method: 'DELETE' });
                          if (res.ok) obtenerGatos();
                        } catch (err) {
                          console.error("Error al borrar:", err);
                        }
                      }
                    }}
                    style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'transparent', border: 'none', color: '#feb2b2', cursor: 'pointer' }}
                    title="Eliminar michi"
                  >
                    <Trash2 size={18} />
                  </button>

                  <h3 style={{ margin: '0 0 10px 0', color: '#2d3748', fontSize: '1.4rem', paddingRight: '25px' }}>{gato.nombre}</h3>
                  <p style={{ margin: '5px 0', color: '#718096' }}><strong>Edad:</strong> {gato.edad} {gato.edad === 1 ? 'año' : 'años'}</p>
                  
                  {/* Desestructuración e iteración automática del JSONB */}
                  {gato.detalles && Object.keys(gato.detalles).length > 0 ? (
                    <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#f7fafc', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.keys(gato.detalles).map((key) => (
                        <p key={key} style={{ margin: 0, color: '#4a5568', textTransform: 'capitalize' }}>
                          <strong>✨ {key.replace('_', ' ')}:</strong> {gato.detalles[key]}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: '#a0aec0', fontSize: '0.85rem', marginTop: '10px' }}>Sin cualidades añadidas</p>
                  )}
                  
                  <div style={{ fontSize: '0.62rem', color: '#cbd5e0', marginTop: '15px', textAlign: 'right', fontFamily: 'monospace' }}>
                    UUID: {gato.id.substring(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
export default App;