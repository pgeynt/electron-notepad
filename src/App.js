import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Nav, Card, Button, Form } from 'react-bootstrap'
import { Star, StarFill, Plus, Pencil, Palette, Trash, Image, ChevronRight } from 'react-bootstrap-icons'
import TitleBar from './components/TitleBar'
import './styles.css'

function App() {
  // Notları localStorage'dan yükle
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes
      ? JSON.parse(savedNotes)
      : [
          {
            id: 1,
            title: 'İsimsiz',
            content: 'şimdi istediğim şey vue dosyasının en alt kısmına yeni bir kısım oluşturmak istiyorum...',
            date: '26.12.24',
            starred: false,
            color: '',
            // images: [] // İsterseniz başlangıç için ekleyebilirsiniz
          },
          {
            id: 2,
            title: 'yeni',
            content: 'Kural ver ve ürün linki ile ürün SKU ver...',
            date: '26.12.24',
            starred: false,
            color: ''
          },
          {
            id: 3,
            title: 'buglar',
            content: 'hb ty n1pzrm amz kısımlarında tl fiyat yoksa dolar...',
            date: '25.12.24',
            starred: false,
            color: ''
          },
          {
            id: 4,
            title: 'prompt devam',
            content: 'RESİMDE SANA GÖSTERDİĞİM...',
            date: '19.12.24',
            starred: false,
            color: ''
          }
        ]
  })

  // Notları localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const [selectedNote, setSelectedNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showStarred, setShowStarred] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [draggedImage, setDraggedImage] = useState(null)
  const [resizingImage, setResizingImage] = useState(null)
  const [imageContextMenu, setImageContextMenu] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Context menüleri kapat
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null)
      setImageContextMenu(null)
      setDraggedImage(null)
      setResizingImage(null)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleContextMenu = (e, note) => {
    e.preventDefault()
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      noteId: note.id,
      isEditor: false
    })
  }

  const handleEditTitle = (noteId) => {
    const note = notes.find(n => n.id === noteId)
    setEditingNoteId(noteId)
    setEditingTitle(note.title)
    setContextMenu(null)
  }

  const saveEditedTitle = () => {
    setNotes(notes.map(note =>
      note.id === editingNoteId ? { ...note, title: editingTitle } : note
    ))
    setEditingNoteId(null)
    setEditingTitle('')
  }

  const handleColorChange = (noteId, color) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, color } : note
    )
    setNotes(updatedNotes)
    setContextMenu(null)
  }

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
    setContextMenu(null)
  }

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Yeni Not',
      content: '',
      date: new Date().toLocaleDateString('tr-TR'),
      starred: false,
      color: ''
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note)
  }

  const handleNoteChange = (e) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, content: e.target.value }
      setSelectedNote(updatedNote)
      setNotes(notes.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ))
    }
  }

  const toggleStar = (e, noteId) => {
    e.stopPropagation() // Kartın tıklanmasını engeller
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ))
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase())
    return showStarred ? matchesSearch && note.starred : matchesSearch
  })

  const handleAddImage = async () => {
    // Seçili not yoksa erkenden çık
    if (!selectedNote) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            url: e.target.result,
            x: 50,
            y: 50,
            width: 200,
            height: 200
          }
          
          const updatedNote = {
            ...selectedNote,
            images: [...(selectedNote.images || []), newImage]
          }
          
          setSelectedNote(updatedNote)
          setNotes(notes.map(note =>
            note.id === selectedNote.id ? updatedNote : note
          ))
        }
        reader.readAsDataURL(file)
      }
    }
    
    input.click()
  }

  const handleImageContextMenu = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    setImageContextMenu({
      x: e.pageX,
      y: e.pageY,
      imageIndex: index
    })
  }

  const handleDeleteImage = (index) => {
    const updatedImages = selectedNote.images.filter((_, i) => i !== index)
    const updatedNote = { ...selectedNote, images: updatedImages }
    setSelectedNote(updatedNote)
    setNotes(notes.map(note =>
      note.id === selectedNote.id ? updatedNote : note
    ))
    setImageContextMenu(null)
  }

  const handleImageMouseDown = (e, index, type) => {
    e.preventDefault()
    e.stopPropagation()
    
    const editorRect = document.querySelector('.note-editor').getBoundingClientRect()
    const image = selectedNote.images[index]
    
    if (type === 'move') {
      const imageRect = e.currentTarget.getBoundingClientRect()
      const offsetX = e.clientX - imageRect.left
      const offsetY = e.clientY - imageRect.top
      
      setDraggedImage({ 
        index, 
        offsetX,
        offsetY,
        editorRect
      })
    } else {
      setResizingImage({ 
        index, 
        type,
        startWidth: image.width,
        startHeight: image.height,
        startX: image.x,
        startY: image.y,
        editorRect,
        mouseStartX: e.clientX,
        mouseStartY: e.clientY
      })
    }
  }

  const handleMouseMove = (e) => {
    if (draggedImage) {
      e.preventDefault()
      
      const newX = e.clientX - draggedImage.offsetX - draggedImage.editorRect.left
      const newY = e.clientY - draggedImage.offsetY - draggedImage.editorRect.top
      
      const image = selectedNote.images[draggedImage.index]
      const maxX = draggedImage.editorRect.width - image.width
      const maxY = draggedImage.editorRect.height - image.height
      
      const boundedX = Math.max(0, Math.min(newX, maxX))
      const boundedY = Math.max(0, Math.min(newY, maxY))
      
      const updatedImages = [...selectedNote.images]
      updatedImages[draggedImage.index] = {
        ...image,
        x: boundedX,
        y: boundedY
      }
      
      const updatedNote = { ...selectedNote, images: updatedImages }
      setSelectedNote(updatedNote)
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ))
    }
    
    if (resizingImage) {
      e.preventDefault()
      
      const dx = e.clientX - resizingImage.mouseStartX
      const dy = e.clientY - resizingImage.mouseStartY
      
      let newWidth = resizingImage.startWidth
      let newHeight = resizingImage.startHeight
      let newX = resizingImage.startX
      let newY = resizingImage.startY
      
      const aspectRatio = resizingImage.startWidth / resizingImage.startHeight
      
      switch (resizingImage.type) {
        case 'top-left':
          newWidth = resizingImage.startWidth - dx
          newHeight = newWidth / aspectRatio
          newX = resizingImage.startX + dx
          newY = resizingImage.startY + (resizingImage.startHeight - newHeight)
          break
        case 'top-right':
          newWidth = resizingImage.startWidth + dx
          newHeight = newWidth / aspectRatio
          newY = resizingImage.startY + (resizingImage.startHeight - newHeight)
          break
        case 'bottom-left':
          newWidth = resizingImage.startWidth - dx
          newHeight = newWidth / aspectRatio
          newX = resizingImage.startX + dx
          break
        case 'bottom-right':
          newWidth = resizingImage.startWidth + dx
          newHeight = newWidth / aspectRatio
          break
        default:
          break
      }
      
      // Minimum ve maksimum boyut kontrolleri
      const minSize = 50
      const maxWidth = resizingImage.editorRect.width - newX
      const maxHeight = resizingImage.editorRect.height - newY
      
      newWidth = Math.max(minSize, Math.min(newWidth, maxWidth))
      newHeight = Math.max(minSize, Math.min(newHeight, maxHeight))
      
      // Sınırlar içinde kalmasını sağla
      newX = Math.max(0, Math.min(newX, resizingImage.editorRect.width - newWidth))
      newY = Math.max(0, Math.min(newY, resizingImage.editorRect.height - newHeight))
      
      const updatedImages = [...selectedNote.images]
      updatedImages[resizingImage.index] = {
        ...updatedImages[resizingImage.index],
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY
      }
      
      const updatedNote = { ...selectedNote, images: updatedImages }
      setSelectedNote(updatedNote)
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ))
    }
  }

  const handleMouseUp = () => {
    setDraggedImage(null)
    setResizingImage(null)
  }

  const handleNoteContextMenu = (e) => {
    e.preventDefault()
    if (selectedNote) {
      setContextMenu({
        x: e.pageX,
        y: e.pageY,
        noteId: selectedNote.id,
        isEditor: true
      })
    }
  }

  return (
    <>
      <TitleBar />
      <div className="main-content">
        <Container fluid>
          <Row>
            {/* Sol Sidebar */}
            <Col className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
              <div className={`sidebar-content ${isSidebarCollapsed ? 'd-none' : ''}`}>
                <button className="new-note-btn" onClick={addNewNote}>
                  <Plus size={20} /> Yeni Not
                </button>
                
                <div className="mb-4">
                  <h5 style={{ color: 'var(--periwinkle-1)' }}>Notlar</h5>
                  <Nav className="flex-column mb-3">
                    <Nav.Item>
                      <Nav.Link 
                        active={!showStarred}
                        onClick={() => setShowStarred(false)}
                      >
                        Son
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={showStarred}
                        onClick={() => setShowStarred(true)}
                      >
                        Yıldızlananlar
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  
                  <Form.Control
                    type="search"
                    placeholder="Not başlıklarında ara..."
                    className="mb-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="notes-list">
                  {filteredNotes.map(note => (
                    <Card 
                      key={note.id} 
                      className={`mb-2 note-card ${
                        selectedNote?.id === note.id ? 'selected' : ''
                      } ${note.color ? 'has-color' : ''}`}
                      onClick={() => handleNoteClick(note)}
                      onContextMenu={(e) => handleContextMenu(e, note)}
                    >
                      <Card.Body className="p-2">
                        <div className="d-flex">
                          <div className="flex-grow-1 pe-2 overflow-hidden">
                            {editingNoteId === note.id ? (
                              <input
                                type="text"
                                className="form-control form-control-sm mb-1"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={saveEditedTitle}
                                onKeyDown={(e) => e.key === 'Enter' && saveEditedTitle()}
                                autoFocus
                              />
                            ) : (
                              <Card.Title className="h6 text-truncate mb-1">
                                {note.title}
                              </Card.Title>
                            )}
                            <Card.Text className="text-truncate small mb-1">
                              {note.content}
                            </Card.Text>
                            <small>{note.date}</small>
                          </div>
                          <div className="flex-shrink-0">
                            <Button 
                              variant="link" 
                              className="p-0"
                              onClick={(e) => toggleStar(e, note.id)}
                            >
                              {note.starred ? <StarFill size={16} /> : <Star size={16} />}
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                      {note.color && (
                        <div className={`color-bar color-${note.color}`} />
                      )}
                    </Card>
                  ))}
                </div>
              </div>
              <button 
                className="sidebar-toggle"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <ChevronRight size={16} />
              </button>
            </Col>

            {/* Sağ İçerik */}
            <Col className="content-area">
              {selectedNote && (
                <div className="note-content">
                  <input
                    type="text"
                    className="note-title-input"
                    value={selectedNote.title}
                    onChange={(e) => {
                      const updatedNote = { ...selectedNote, title: e.target.value }
                      setSelectedNote(updatedNote)
                      setNotes(notes.map(note => 
                        note.id === selectedNote.id ? updatedNote : note
                      ))
                    }}
                    placeholder="Başlık..."
                  />
                  <div 
                    className="note-editor"
                    onContextMenu={(e) => handleNoteContextMenu(e)}
                  >
                    <textarea
                      className="form-control"
                      placeholder="Yazmaya başlayın..."
                      value={selectedNote.content}
                      onChange={handleNoteChange}
                    />
                    <div className="images-container">
                      {selectedNote.images && selectedNote.images.map((image, index) => (
                        <div
                          key={index}
                          className="resizable-image"
                          style={{
                            position: 'absolute',
                            left: image.x,
                            top: image.y,
                            width: image.width,
                            height: image.height,
                          }}
                          onMouseDown={(e) => handleImageMouseDown(e, index, 'move')}
                          onContextMenu={(e) => handleImageContextMenu(e, index)}
                        >
                          <img
                            src={image.url}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            draggable={false}
                          />
                          <div className="resize-handles">
                            <div 
                              className="resize-handle top-left"
                              onMouseDown={(e) => handleImageMouseDown(e, index, 'top-left')}
                            />
                            <div 
                              className="resize-handle top-right"
                              onMouseDown={(e) => handleImageMouseDown(e, index, 'top-right')}
                            />
                            <div 
                              className="resize-handle bottom-left"
                              onMouseDown={(e) => handleImageMouseDown(e, index, 'bottom-left')}
                            />
                            <div 
                              className="resize-handle bottom-right"
                              onMouseDown={(e) => handleImageMouseDown(e, index, 'bottom-right')}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mouse event handlers */}
      {(draggedImage || resizingImage) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: resizingImage ? `${resizingImage.type}-resize` : 'move',
            zIndex: 9999
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          {contextMenu.isEditor ? (
            <div className="context-menu-item" onClick={() => handleAddImage()}>
              <Image size={14} /> Görsel Ekle
            </div>
          ) : (
            <>
              <div className="context-menu-item" onClick={() => handleEditTitle(contextMenu.noteId)}>
                <Pencil size={14} /> Başlığı Düzenle
              </div>
              <div className="context-menu-item">
                <Palette size={14} /> Renk Seç
                <div className="color-picker">
                  <div 
                    className="color-option no-color" 
                    onClick={() => handleColorChange(contextMenu.noteId, '')} 
                    title="Renk Yok"
                  />
                  <div 
                    className="color-option color-1" 
                    onClick={() => handleColorChange(contextMenu.noteId, '1')} 
                    title="#7339AB"
                  />
                  <div 
                    className="color-option color-2" 
                    onClick={() => handleColorChange(contextMenu.noteId, '2')} 
                    title="#625AD8"
                  />
                  <div 
                    className="color-option color-3" 
                    onClick={() => handleColorChange(contextMenu.noteId, '3')} 
                    title="#1F9CE4"
                  />
                  <div 
                    className="color-option color-4" 
                    onClick={() => handleColorChange(contextMenu.noteId, '4')} 
                    title="#88F4FF"
                  />
                  {/* Eklenen color-5 seçeneği */}
                  <div 
                    className="color-option color-5" 
                    onClick={() => handleColorChange(contextMenu.noteId, '5')} 
                    title="#D98AEF"
                  />
                </div>
              </div>
              <div className="context-menu-item danger" onClick={() => deleteNote(contextMenu.noteId)}>
                <Trash size={14} /> Kaldır
              </div>
            </>
          )}
        </div>
      )}

      {/* Görsel Context Menu */}
      {imageContextMenu && (
        <div 
          className="context-menu"
          style={{ top: imageContextMenu.y, left: imageContextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <div className="context-menu-item danger" onClick={() => handleDeleteImage(imageContextMenu.imageIndex)}>
            <Trash size={14} /> Görseli Kaldır
          </div>
        </div>
      )}
    </>
  )
}

export default App
