from flask import Flask, jsonify, request
import psycopg2
import csv
import json
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
CORS(app)
Swagger(app)
#cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SWAGGER'] = {
    'title': 'BNP Paribas Property Management API',
    'uiversion': 3,
    'definitions': {
        'Property': {
            'type': 'object',
            'properties': {
                'propertyId': {'type': 'integer'},
                'address': {'type': 'string'},
                'property_type': {'type': 'string'},
                'status': {'type': 'string'},
                'purchase_date': {'type': 'string'},
                'price': {'type': 'integer'}
            }
        }
    }
}


connection = psycopg2.connect(database="Kata_BNPParibas",
                                user="postgres",
                                password="root",
                                host="localhost",
                                port="5432")
cursor = connection.cursor()
def clear_create_table():
    cursor.execute('''
            DROP TABLE IF EXISTS properties CASCADE;
            CREATE TABLE IF NOT EXISTS properties (
                propertyId SERIAL PRIMARY KEY,
                address TEXT,
                property_type TEXT,
                status TEXT,
                purchase_date DATE,
                price INTEGER
            )
        ''')
    cursor.execute('''
            DROP TABLE IF EXISTS tenants;
            CREATE TABLE IF NOT EXISTS tenants (
                tenantId SERIAL PRIMARY KEY,
                name TEXT,
                contact_info TEXT,
                lease_term_start DATE,
                lease_term_end DATE,
                rental_payment_status TEXT,
                propertyId INTEGER REFERENCES properties(propertyId)
            )
        ''')
    cursor.execute('''
            DROP TABLE IF EXISTS maintenances;
            CREATE TABLE IF NOT EXISTS maintenances (
                taskId SERIAL PRIMARY KEY,
                description TEXT,
                status TEXT,
                scheduled_date DATE,
                propertyId INTEGER REFERENCES properties(propertyId)
            )
        ''')
    connection.commit()

def ingest_csvdata():
    with open('properties.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cursor.execute('''
                    INSERT INTO properties
                    VALUES (DEFAULT, %s, %s, %s, %s, %s)
                ''', (row['Address'], row['PropertyType'], row['Status'], row['PurchaseDate'], row['Price']))

    with open('tenants.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cursor.execute('''
                    INSERT INTO tenants
                    VALUES (DEFAULT, %s, %s, %s, %s, %s, %s)
                ''', (row['Name'], row['ContactInfo'], row['LeaseTermStart'], row['LeaseTermEnd'], row['RentalPaymentStatus'], row['PropertyID']))
            
    with open('maintenance.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cursor.execute('''
                    INSERT INTO maintenances
                    VALUES (DEFAULT, %s, %s, %s, %s)
                ''', (row['Description'], row['Status'], row['ScheduledDate'], row['PropertyID']))
            
    connection.commit()

@app.route('/properties', methods=['GET'])
def get_properties():
    """
    Get all properties
    ---
    responses:
      200:
        description: A list of properties
        schema:
          type: array
    """
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM properties")
            properties = cursor.fetchall()
            connection.commit()
            return jsonify(properties)
        
@app.route('/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    """
Get one property
---
parameters:
  - name: property_id
    in: path
    type: integer
    required: true
    description: ID of the property to retrieve
responses:
  200:
    description: One property
    schema:
      type: object
      properties:
        propertyid:
          type: integer
          example: 1
        address:
          type: string
          example: "12 rue de l'alma"
        property_type:
          type: string
          example: Residential
        status:
          type: string
          example: Vacant
        purchase_date:
          type: string
          format: date
          example: "1998-02-01"
        price:
          type: integer
          example: 1200
"""


    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM properties WHERE propertyid = %s", [property_id])
            property = cursor.fetchone()
            if property:
                return jsonify({'property': property, 'message': 'Property found'}), 200
            else:
                return jsonify({'property':[],'message': 'Property not found'}), 404

@app.route('/properties', methods=['POST'])
def add_property():
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            data = request.get_json()
            cursor.execute('''
                           INSERT INTO properties (address, property_type, status, purchase_date, price)
                           VALUES (%s, %s, %s, %s, %s)
                           ''',
                           (data['address'], data['property_type'], data['status'], data['purchase_date'], data['price']))
            connection.commit()
            return jsonify({'message': 'Property added successfully'}), 201

@app.route('/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT propertyid FROM properties WHERE propertyid = %s', [property_id])
            property = cursor.fetchall()
            if not property:
                return jsonify({'message':'Property not found'}), 404
            
            cursor.execute('SELECT COUNT(*) FROM tenants WHERE propertyid = %s', [property_id])
            tenants_count = cursor.fetchone()[0]
            cursor.execute('SELECT COUNT(*) FROM maintenances WHERE propertyid = %s', [property_id])
            maintenance_count = cursor.fetchone()[0]
            if tenants_count > 0:
                return jsonify({'message': 'Cannot delete property with associated tenants. Reassign or delete tenants first'}), 400
            elif maintenance_count > 0:
                return jsonify({'message': 'Cannot delete property with associated maintenance tasks. Reassign or delete maintenance tasks first'}), 400
            elif tenants_count == 0 and maintenance_count == 0:
                cursor.execute('DELETE FROM properties WHERE propertyid = %s', [property_id])
                connection.commit()
                return jsonify({'message': 'Property deleted successfully'}), 200
            else:
                return jsonify({'message': 'Failed to delete property'}), 500
        
@app.route('/properties/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    data = request.get_json()
    
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT propertyid FROM properties WHERE propertyid = %s', [property_id])
            property = cursor.fetchall()
            if property:
                cursor.execute('''
                            UPDATE properties
                            SET address = %s, property_type = %s, status = %s, 
                                purchase_date = %s, price = %s
                            WHERE propertyId = %s
                            ''',
                            (data['address'], data['property_type'], data['status'],
                            data['purchase_date'], data['price'], property_id))
                connection.commit()
                return jsonify({'message':'Property updated successfully'}), 200
            else:
                return jsonify({'message':'Property not found'}), 404
            
            
@app.route('/tenants', methods=['GET'])
def get_tenants():
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM tenants")
            tenants = cursor.fetchall()
            connection.commit()
            return jsonify(tenants)
        
@app.route('/tenants/<int:tenant_id>', methods=['GET'])
def get_tenant(tenant_id):
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM tenants WHERE tenantid = %s", [tenant_id])
            tenant = cursor.fetchone()
            if tenant:
                return jsonify(tenant)
            else:
                return jsonify({'message': 'Tenant not found'}), 404

@app.route('/tenants', methods=['POST'])
def add_tenants():
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            data = request.get_json()
            cursor.execute('''
                           INSERT INTO tenants (name, contact_info, lease_term_start, lease_term_end, rental_payment_status, propertyid)
                           VALUES (%s, %s, %s, %s, %s, %s)
                           ''',
                           (data['name'], data['contact_info'], data['lease_term_start'], data['lease_term_end'], data['rental_payment_status'],data['propertyid']))
            connection.commit()
            return jsonify({'message': 'Tenants added successfully'}), 201

@app.route('/tenants/<int:tenant_id>', methods=['DELETE'])
def delete_tenant(tenant_id):
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT tenantid FROM tenants WHERE tenantid = %s', [tenant_id])
            tenant = cursor.fetchall()
            if not tenant:
                return jsonify({'message':'Tenant not found'}), 404
            else:
                cursor.execute('DELETE FROM tenants WHERE tenantid = %s', [tenant_id])
                connection.commit()
                return jsonify({'message': 'Tenant deleted successfully'}), 200

@app.route('/tenants/<int:tenant_id>', methods=['PUT'])
def update_tenant(tenant_id):
    data = request.get_json()
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT tenantid FROM tenants WHERE tenantid = %s', [tenant_id])
            tenant = cursor.fetchall()
            if tenant:
                cursor.execute('''
                            UPDATE tenants
                            SET name = %s, contact_info = %s, lease_term_start = %s, 
                                lease_term_end = %s, rental_payment_status = %s, propertyid = %s
                            WHERE tenantid = %s
                            ''',
                            (data['name'], data['contact_info'], data['lease_term_start'],
                            data['lease_term_end'], data['rental_payment_status'], data['propertyid'], tenant_id))
                connection.commit()
                return jsonify({'message':'Tenant updated successfully'}), 200
            else:
                return jsonify({'message':'Tenant not found'}), 404


@app.route('/maintenances', methods=['GET'])
def get_maintenances():
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM maintenances")
            maintenances = cursor.fetchall()
            connection.commit()
            return jsonify(maintenances)
        
@app.route('/maintenances/<int:task_id>', methods=['GET'])
def get_maintenance(task_id):
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM maintenances WHERE taskid = %s", [task_id])
            maintenance = cursor.fetchone()
            if maintenance:
                return jsonify(maintenance)
            else:
                return jsonify({'message': 'Task not found'}), 404

@app.route('/maintenances', methods=['POST'])
def add_maintenance():
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            data = request.get_json()
            cursor.execute('''
                           INSERT INTO maintenances (description, status, scheduled_date, propertyid)
                           VALUES (%s, %s, %s, %s)
                           ''',
                           (data['description'], data['status'], data['scheduled_date'], data['propertyid']))
            connection.commit()
            return jsonify({'message': 'Task added successfully'}), 201

@app.route('/maintenances/<int:task_id>', methods=['DELETE'])
def delete_maintenance(task_id):
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT taskid FROM maintenances WHERE taskid = %s', [task_id])
            maintenance = cursor.fetchall()
            if not maintenance:
                return jsonify({'message':'Task not found'}), 404
            else:
                cursor.execute('DELETE FROM maintenances WHERE taskid = %s', [task_id])
                connection.commit()
                return jsonify({'message': 'Task deleted successfully'}), 200

@app.route('/maintenances/<int:task_id>', methods=['PUT'])
def update_maintenance(task_id):
    data = request.get_json()
    with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT taskid FROM maintenances WHERE taskid = %s', [task_id])
            task = cursor.fetchall()
            if task:
                cursor.execute('''
                            UPDATE maintenances
                            SET description = %s, status = %s, scheduled_date = %s, 
                                propertyid = %s
                            WHERE taskid = %s
                            ''',
                            (data['description'], data['status'], data['scheduled_date'],
                            data['propertyid'], task_id))
                connection.commit()
                return jsonify({'message':'Task updated successfully'}), 200
            else:
                return jsonify({'message':'Task not found'}), 404

    
cursor.close()
connection.close()

with psycopg2.connect(database="Kata_BNPParibas",
                              user="postgres",
                              password="root",
                              host="localhost",
                              port="5432") as connection:
        with connection.cursor() as cursor:
            clear_create_table()
            ingest_csvdata()
if __name__ == "__main__":
    
    app.run(debug=True)