# import logging
# from logging.handlers import RotatingFileHandler
# import os

# def setup_logger():
#     logger = logging.getLogger('app')
#     logger.setLevel(logging.INFO)

#     if not os.path.exists('logs'):
#         os.makedirs('logs')

#     file_handler = RotatingFileHandler(
#         'logs/app.log', 
#         maxBytes=1024 * 1024,  # 1MB
#         backupCount=5
#     )
#     formatter = logging.Formatter(
#         '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
#     )
#     file_handler.setFormatter(formatter)
#     logger.addHandler(file_handler)

#     return logger

# logger = setup_logger() 