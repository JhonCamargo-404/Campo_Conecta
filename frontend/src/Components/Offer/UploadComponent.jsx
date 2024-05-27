import { Trash } from 'phosphor-react';
import { useCallback, useState, useEffect } from 'react';
import { Upload } from 'keep-react';
import folderIcon from '../../Assets/Image.svg';

export const UploadComponent = ({ initialImages = [], onFilesSelected, onImageRemove }) => {
    const [files, setFiles] = useState([]);
    const [initialFiles, setInitialFiles] = useState(initialImages);

    useEffect(() => {
        setInitialFiles(initialImages);
    }, [initialImages]);

    const onDrop = useCallback((acceptedFiles) => {
        // Filtra solo archivos de imagen
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        setFiles(imageFiles);
        onFilesSelected([...initialFiles, ...imageFiles]);  // Actualizar el estado en el componente padre
    }, [initialFiles, onFilesSelected]);

    const handleRemoveFile = (fileName) => {
        const newFiles = files.filter(file => file.name !== fileName);
        setFiles(newFiles);
        onFilesSelected([...initialFiles, ...newFiles]);  // Actualizar el estado en el componente padre
    };

    const handleRemoveInitialFile = (fileUrl) => {
        const newInitialFiles = initialFiles.filter(file => file !== fileUrl);
        setInitialFiles(newInitialFiles);
        onImageRemove(fileUrl);
        onFilesSelected([...newInitialFiles, ...files]);  // Actualizar el estado en el componente padre
    };

    return (
        <Upload options={{ onDrop, multiple: true, accept: 'image/*' }}>
            <Upload.Body>
                <Upload.Icon>
                    <img src={folderIcon} alt="folder" />
                </Upload.Icon>
                <Upload.Text>
                    <p>Arrastrar y suelta un archivo para añadirlos</p>
                    <p>Formatos permitidos (e.g., JPG, PNG), tamaño máximo 50 MB.</p>
                </Upload.Text>
            </Upload.Body>
            <Upload.Footer isFileExists={files.length > 0 || initialFiles.length > 0}>
                <ul>
                    {initialFiles.map((fileUrl, index) => (
                        <li key={index}>
                            <img src={fileUrl} alt={`Imagen ${index + 1}`} style={{ width: 50, height: 50 }} />
                            <Trash size={16} color="red" onClick={() => handleRemoveInitialFile(fileUrl)} />
                        </li>
                    ))}
                    {files.map((file) => (
                        <li key={file.name}>
                            {file.name}
                            <Trash size={16} color="red" onClick={() => handleRemoveFile(file.name)} />
                        </li>
                    ))}
                </ul>
            </Upload.Footer>
        </Upload>
    )
}
