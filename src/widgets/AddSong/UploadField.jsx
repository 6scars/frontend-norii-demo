import Icon from '../../shared/ui/Icon.jsx'

export default function UploadField({ accept, error, file, hint, id, label, onFile }) {
  const chooseFile = (files) => {
    const nextFile = files?.[0]
    if (nextFile) onFile(nextFile)
  }
  const describedBy = error ? `${id}-hint ${id}-error` : `${id}-hint`

  return (
    <label
      className={error ? 'upload-field upload-field--error' : 'upload-field'}
      htmlFor={id}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        chooseFile(event.dataTransfer.files)
      }}
    >
      <input accept={accept} aria-describedby={describedBy} aria-invalid={Boolean(error)} id={id} onChange={(event) => chooseFile(event.target.files)} type="file" />
      <span className="upload-field__icon"><Icon name="plus" size={23} /></span>
      <strong>{file ? file.name : label}</strong>
      <small id={`${id}-hint`}>{file ? 'Kliknij lub upuść plik, aby go zmienić.' : hint}</small>
      {error ? <em id={`${id}-error`} role="alert">{error}</em> : null}
    </label>
  )
}
