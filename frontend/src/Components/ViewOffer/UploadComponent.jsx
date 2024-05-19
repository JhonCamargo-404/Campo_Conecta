import { Trash } from 'phosphor-react';
import { useCallback, useState } from 'react';
import { Upload } from 'keep-react';
import folderIcon from '../../Assets/Image.svg';

export const UploadComponent = ({ onFilesSelected }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        // Filtra solo archivos PDF
        const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
        setFiles(pdfFiles);
        onFilesSelected(pdfFiles);  // Notificar al componente padre sobre los archivos seleccionados
    }, [onFilesSelected]);

    const handleRemoveFile = (fileName) => {
        const newFiles = files.filter(file => file.name !== fileName);
        setFiles(newFiles);
        onFilesSelected(newFiles);  // Actualizar el estado en el componente padre
    };

    return (
        <Upload options={{ onDrop, multiple: true, accept: 'application/pdf' }}>
            <Upload.Body>
                <Upload.Icon>
                    <img src={folderIcon} alt="folder" />
                </Upload.Icon>
                <Upload.Text>
                    <p>Drag & Drop or Choose a PDF file to Upload</p>
                    <p>Only PDF format allowed, up to 50 MB.</p>
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
    );
};
