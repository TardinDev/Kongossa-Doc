-- Add document_number field to documents table
-- This will be a unique identifier starting with # (e.g., #1001, #1002, etc.)

-- Add the column
ALTER TABLE documents
ADD COLUMN document_number VARCHAR(20) UNIQUE;

-- Create a sequence for generating document numbers
CREATE SEQUENCE IF NOT EXISTS document_number_seq START 1001;

-- Function to generate document number with # prefix
CREATE OR REPLACE FUNCTION generate_document_number()
RETURNS VARCHAR AS $$
DECLARE
    next_num INTEGER;
    doc_number VARCHAR(20);
BEGIN
    -- Get next sequence value
    next_num := nextval('document_number_seq');

    -- Format as #XXXX
    doc_number := '#' || next_num;

    RETURN doc_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate document number on insert
CREATE OR REPLACE FUNCTION set_document_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set document_number if it's NULL
    IF NEW.document_number IS NULL THEN
        NEW.document_number = generate_document_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_set_document_number
    BEFORE INSERT ON documents
    FOR EACH ROW
    EXECUTE FUNCTION set_document_number();

-- Create index for faster searches by document_number
CREATE INDEX idx_documents_document_number ON documents(document_number);

-- Update existing documents to have document numbers (if any exist)
DO $$
DECLARE
    doc RECORD;
BEGIN
    FOR doc IN SELECT id FROM documents WHERE document_number IS NULL ORDER BY created_at
    LOOP
        UPDATE documents
        SET document_number = generate_document_number()
        WHERE id = doc.id;
    END LOOP;
END $$;

-- Update the get_documents_with_favorites function to include document_number
CREATE OR REPLACE FUNCTION get_documents_with_favorites(p_user_id VARCHAR)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    type VARCHAR,
    preview_url TEXT,
    download_url TEXT,
    owner_id VARCHAR,
    mime_type VARCHAR,
    size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    thumbnail_url TEXT,
    tags TEXT[],
    view_count INTEGER,
    download_count INTEGER,
    category VARCHAR,
    description TEXT,
    document_number VARCHAR,
    is_favorite BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.*,
        EXISTS(SELECT 1 FROM favorites f WHERE f.document_id = d.id AND f.user_id = p_user_id) as is_favorite
    FROM documents d;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON COLUMN documents.document_number IS 'Unique identifier for the document, formatted as #XXXX (e.g., #1001). Automatically generated on insert.';
