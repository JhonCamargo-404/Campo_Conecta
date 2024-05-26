import { Trash } from 'phosphor-react';
import { useCallback, useState } from 'react';
import { Upload } from 'keep-react';
import folderIcon from '../../Assets/Image.svg';

export const UploadComponent = ({ onFilesSelected }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        // Filtra solo archivos de imagen
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        setFiles(imageFiles);
        onFilesSelected(imageFiles);  // Actualizar el estado en el componente padre
    }, [onFilesSelected]);

    const handleRemoveFile = (fileName) => {
        const newFiles = files.filter(file => file.name !== fileName);
        setFiles(newFiles);
        onFilesSelected(newFiles);  // Actualizar el estado en el componente padre
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
            <Upload.Footer isFileExists={files.length > 0}>
                <ul>
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
