# Makefile for generating a self-signed code signing certificate (CSC)

# Variables
PRIVATE_KEY := private_key.pem
CSR := csr.pem
CERTIFICATE := certificate.pem
PFX := certificate.pfx

# Targets
all: $(PFX)

$(PFX): $(CERTIFICATE) $(PRIVATE_KEY)
	@echo "Exporting certificate as .pfx file..."
	openssl pkcs12 -export -out $(PFX) -inkey $(PRIVATE_KEY) -in $(CERTIFICATE)
	@echo "Self-signed code signing certificate generated: $(PFX)"

$(CERTIFICATE): $(CSR)
	@echo "Generating self-signed certificate..."
	openssl x509 -req -in $(CSR) -signkey $(PRIVATE_KEY) -out $(CERTIFICATE) -days 365

$(CSR): $(PRIVATE_KEY)
	@echo "Generating certificate signing request (CSR)..."
	openssl req -new -key $(PRIVATE_KEY) -out $(CSR)

$(PRIVATE_KEY):
	@echo "Generating private key..."
	openssl genpkey -algorithm RSA -out $(PRIVATE_KEY) -aes256
	@echo "Private key generated: $(PRIVATE_KEY)"

clean:
	@echo "Cleaning up..."
	rm -f $(PRIVATE_KEY) $(CSR) $(CERTIFICATE) $(PFX)
	@echo "Cleanup complete."

.PHONY: all clean
