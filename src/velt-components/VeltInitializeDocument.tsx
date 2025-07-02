import { useSetDocuments } from '@veltdev/react';
import { useEffect } from 'react';

function VeltInitializeDocument() {

    const { setDocuments } = useSetDocuments();

    useEffect(() => {
        setDocuments([
            {
                id: 'document1-25-jun-2025',
                metadata: {
                    documentName: 'Document1 25 Jun 2025',
                }
            }
        ])
    }, []);

    return (
        <></>
    )
}

export default VeltInitializeDocument;